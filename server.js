const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const srv = http.createServer(app);
const io = new Server(srv, { cors: { origin: '*' } });
app.use(express.static(path.join(__dirname)));

const BOMB_TIME=40, ROUND_TIME=120, BUY_TIME=15, MAX_ROUNDS=6;
const rooms={};

function createRoom(id){
  return{id,players:{},phase:'waiting',
    round:{num:1,timer:ROUND_TIME,phase:'buying'},
    score:{ct:0,t:0},
    bomb:{exists:false,carried:false,planted:false,bombTimer:0,plantX:0,plantZ:0,siteName:'',carrierId:null},
    selMap:0,loop:null,lastTick:Date.now()};
}
function getRoom(id){
  if(!rooms[id]){rooms[id]=createRoom(id);startLoop(id);}
  return rooms[id];
}
function mkPlayer(sid,team,name){
  return{id:sid,name:name||('P_'+sid.slice(0,4)),team,alive:false,
    health:100,armor:0,pos:{x:0,y:0,z:0},yaw:0,pitch:0,
    curWepId:team==='ct'?1:0,money:800,kills:0,deaths:0};
}

function startLoop(rid){
  const room=rooms[rid];
  if(room.loop)clearInterval(room.loop);
  room.loop=setInterval(()=>tick(rid),50);
}

function tick(rid){
  const room=rooms[rid];if(!room)return;
  const now=Date.now(),dt=Math.min((now-room.lastTick)/1000,.1);
  room.lastTick=now;
  const plist=Object.values(room.players);
  if(!plist.length)return;

  if(room.phase==='playing'){
    room.round.timer-=dt;
    if(room.bomb.planted){
      room.bomb.bombTimer-=dt;
      if(room.bomb.bombTimer<=0){endRound(rid,'t','Бомба вибухнула!');return;}
    }
    if(room.round.timer<=0&&!room.bomb.planted){endRound(rid,'ct','Час вийшов!');return;}
    const ctAlive=plist.filter(p=>p.team==='ct'&&p.alive).length;
    const tAlive=plist.filter(p=>p.team==='t'&&p.alive).length;
    const cts=plist.filter(p=>p.team==='ct').length;
    const ts=plist.filter(p=>p.team==='t').length;
    if(ts>0&&tAlive===0&&!room.bomb.planted){endRound(rid,'ct','Всі T знищені!');return;}
    if(cts>0&&ctAlive===0){endRound(rid,'t','Всі CT знищені!');return;}
  }

  io.to(rid).emit('state',{
    players:plist.map(p=>({id:p.id,name:p.name,team:p.team,alive:p.alive,
      health:p.health,armor:p.armor,pos:p.pos,yaw:p.yaw,pitch:p.pitch,
      curWepId:p.curWepId,kills:p.kills,deaths:p.deaths})),
    round:room.round,score:room.score,phase:room.phase,
    bomb:{planted:room.bomb.planted,bombTimer:room.bomb.bombTimer,
      siteName:room.bomb.siteName,plantX:room.bomb.plantX,plantZ:room.bomb.plantZ},
    selMap:room.selMap,ts:now,
  });
}

function endRound(rid,winner,reason){
  const room=rooms[rid];if(!room||room.phase!=='playing')return;
  room.phase='end';room.round.phase='end';
  room.score[winner]++;
  room.bomb={exists:false,carried:false,planted:false,bombTimer:0,plantX:0,plantZ:0,siteName:'',carrierId:null};
  Object.values(room.players).forEach(p=>{
    const won=p.team===winner;
    p.money=Math.min(16000,p.money+(won?3250:1400));
    p.alive=false;
  });
  io.to(rid).emit('roundEnd',{winner,reason,score:room.score,round:room.round.num});
  setTimeout(()=>nextRound(rid),5000);
}

function nextRound(rid){
  const room=rooms[rid];if(!room)return;
  if(room.round.num>=MAX_ROUNDS){
    room.phase='matchEnd';
    io.to(rid).emit('matchEnd',{score:room.score});
    return;
  }
  if(room.round.num===3){
    const tmp=room.score.ct;room.score.ct=room.score.t;room.score.t=tmp;
    Object.values(room.players).forEach(p=>{p.team=p.team==='ct'?'t':'ct';});
    io.to(rid).emit('halftime',{score:room.score});
  }
  room.round.num++;room.round.timer=ROUND_TIME;room.round.phase='buying';room.phase='buying';
  room.bomb={exists:true,carried:false,planted:false,bombTimer:0,plantX:0,plantZ:0,siteName:'',carrierId:null};
  const ts=Object.values(room.players).filter(p=>p.team==='t');
  if(ts.length>0){
    const bomber=ts[Math.floor(Math.random()*ts.length)];
    room.bomb.carried=true;room.bomb.carrierId=bomber.id;
    io.to(bomber.id).emit('youHaveBomb');
  }
  Object.values(room.players).forEach(p=>{
    p.alive=true;p.health=100;p.armor=0;p.grenFrag=0;p.grenSmoke=0;
    p.curWepId=p.team==='ct'?1:0;
  });
  io.to(rid).emit('roundStart',{round:room.round.num,phase:'buying',score:room.score,buyTime:BUY_TIME});
  setTimeout(()=>{if(rooms[rid]&&rooms[rid].phase==='buying'){rooms[rid].phase='playing';rooms[rid].round.phase='playing';io.to(rid).emit('buyEnd');}},BUY_TIME*1000);
}

function startFirstRound(rid){
  const room=rooms[rid];
  room.phase='buying';room.round.phase='buying';
  room.bomb={exists:true,carried:false,planted:false,bombTimer:0,plantX:0,plantZ:0,siteName:'',carrierId:null};
  const ts=Object.values(room.players).filter(p=>p.team==='t');
  if(ts.length>0){
    const bomber=ts[Math.floor(Math.random()*ts.length)];
    room.bomb.carried=true;room.bomb.carrierId=bomber.id;
    io.to(bomber.id).emit('youHaveBomb');
  }
  Object.values(room.players).forEach(p=>{p.alive=true;p.health=100;});
  io.to(rid).emit('roundStart',{round:1,phase:'buying',score:room.score,buyTime:BUY_TIME});
  setTimeout(()=>{if(rooms[rid]&&rooms[rid].phase==='buying'){rooms[rid].phase='playing';rooms[rid].round.phase='playing';io.to(rid).emit('buyEnd');}},BUY_TIME*1000);
}

io.on('connection',(socket)=>{
  console.log('Connect:',socket.id);
  let rid=null;

  socket.on('join',({roomId,team,name,selMap})=>{
    rid=roomId||'main';
    const room=getRoom(rid);
    if(!room.players[socket.id]){
      const t=(team==='ct'||team==='t')?team:'ct';
      room.players[socket.id]=mkPlayer(socket.id,t,name);
      if(selMap!==undefined)room.selMap=selMap;
    }
    socket.join(rid);
    const p=room.players[socket.id];
    socket.emit('joined',{id:socket.id,team:p.team,money:p.money,score:room.score,
      phase:room.phase,round:room.round,selMap:room.selMap});
    const count=Object.keys(room.players).length;
    if(count>=2&&room.phase==='waiting')startFirstRound(rid);
    else if(room.phase!=='waiting')p.alive=false;
    io.to(rid).emit('playerList',Object.values(room.players).map(p=>({id:p.id,name:p.name,team:p.team,kills:p.kills,deaths:p.deaths})));
    console.log(`${socket.id}(${p.name}) joined room ${rid} as ${p.team}`);
  });

  socket.on('playerUpdate',(data)=>{
    if(!rid||!rooms[rid])return;
    const p=rooms[rid].players[socket.id];
    if(!p||!p.alive)return;
    if(data.pos)p.pos=data.pos;
    if(data.yaw!==undefined)p.yaw=data.yaw;
    if(data.pitch!==undefined)p.pitch=data.pitch;
    if(data.curWepId!==undefined)p.curWepId=data.curWepId;
    if(data.health!==undefined)p.health=Math.max(0,data.health);
    if(data.armor!==undefined)p.armor=Math.max(0,data.armor);
  });

  socket.on('shoot',(data)=>{if(rid)socket.to(rid).emit('playerShot',{id:socket.id,...data});});

  socket.on('hit',({targetId,damage,head})=>{
    if(!rid||!rooms[rid])return;
    const room=rooms[rid];
    const shooter=room.players[socket.id];
    const target=room.players[targetId];
    if(!target||!target.alive||!shooter)return;
    let dmg=damage*(head?3.5:1);
    if(target.armor>0){const ab=dmg*.5;target.armor=Math.max(0,target.armor-ab);dmg*=.65;}
    target.health-=Math.floor(dmg);
    io.to(targetId).emit('youWereHit',{damage:Math.floor(dmg),head,from:socket.id});
    if(target.health<=0){
      target.alive=false;target.deaths++;shooter.kills++;
      shooter.money=Math.min(16000,shooter.money+300);
      io.to(rid).emit('playerDied',{victimId:targetId,killerId:socket.id,weapon:shooter.curWepId,head});
    }
  });

  socket.on('bombPlant',({x,z,siteName})=>{
    if(!rid||!rooms[rid])return;
    const room=rooms[rid];
    const p=room.players[socket.id];
    if(!p||p.team!=='t')return;
    room.bomb.planted=true;room.bomb.carried=false;
    room.bomb.plantX=x;room.bomb.plantZ=z;
    room.bomb.siteName=siteName;room.bomb.bombTimer=BOMB_TIME;
    io.to(rid).emit('bombPlanted',{x,z,siteName,planterId:socket.id});
  });

  socket.on('bombDefuse',(progress)=>{
    if(!rid||!rooms[rid])return;
    const room=rooms[rid];
    if(!room.bomb.planted)return;
    if(progress>=1){
      room.bomb.planted=false;
      io.to(rid).emit('bombDefused',{defuserId:socket.id});
      endRound(rid,'ct','Бомба знешкоджена!');
    } else {
      socket.to(rid).emit('defuseProgress',{id:socket.id,progress});
    }
  });

  socket.on('buy',({itemId,price})=>{
    if(!rid||!rooms[rid])return;
    const room=rooms[rid];
    const p=room.players[socket.id];
    if(!p||room.phase!=='buying'){socket.emit('buyFail','Фаза купівлі закінчилась');return;}
    if(p.money<price){socket.emit('buyFail','Недостатньо грошей');return;}
    p.money-=price;
    socket.emit('buyOk',{itemId,money:p.money});
  });

  socket.on('chat',(msg)=>{
    if(!rid)return;
    const p=rooms[rid]?.players[socket.id];
    io.to(rid).emit('chat',{id:socket.id,name:p?.name||'?',msg:String(msg).slice(0,120),team:p?.team});
  });

  socket.on('disconnect',()=>{
    console.log('Disconnect:',socket.id);
    if(!rid||!rooms[rid])return;
    const room=rooms[rid];
    delete room.players[socket.id];
    io.to(rid).emit('playerLeft',{id:socket.id});
    if(!Object.keys(room.players).length){clearInterval(room.loop);delete rooms[rid];console.log('Room',rid,'closed');}
  });
});

const PORT=process.env.PORT||3000;
srv.listen(PORT,()=>console.log(`\n🎮 CS Web server → http://localhost:${PORT}\n`));
