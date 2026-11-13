import json,subprocess,os,sys
import soundfile as sf
from kokoro_onnx import Kokoro
T='/tmp/claude-0/-home-claude/f306d385-bbee-5c53-9859-8a099f4f7318/scratchpad/tts/'
k=Kokoro(T+'kokoro-v1.0.onnx',T+'voices-v1.0.bin')
V={'sol':('am_puck',1.05,'asetrate=24000*1.06,aresample=24000,atempo=0.95,aecho=0.6:0.5:7:0.18'),
   'nour':('af_sky',1.0,'asetrate=24000*1.12,aresample=24000,atempo=0.92'),
   'sami':('am_michael',1.0,'anull'),
   'lina':('af_sarah',1.05,'anull'),
   'omar':('am_eric',1.0,'anull')}
L=json.load(open('lines.json'))
os.makedirs('audio',exist_ok=True)
only=sys.argv[1:]
for key,(who,text) in L.items():
    if only and key not in only: continue
    v,sp,fx=V[who]
    s,sr=k.create(text,voice=v,speed=sp,lang='en-us')
    sf.write('/tmp/claude-0/raw.wav',s,sr)
    subprocess.run(['ffmpeg','-v','error','-y','-i','/tmp/claude-0/raw.wav','-af',fx+',loudnorm=I=-16:TP=-1.5','-ac','1','-ar','24000','-c:a','libmp3lame','-b:a','40k','audio/'+key+'.mp3'],check=True)
    print(key,round(len(s)/sr,1))
