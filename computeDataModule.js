function mod(n, m) {
  return ((n % m) + m) % m;
}

var codex= ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
'0','1','2','3','4','5','6','7','8','9'];

export default class colorFromData{
	
	constructor(data){
		this.data =data;
		this.final_F = 440;
		this.final_n = 888;
		this.erase = false;
	}
	get output(){
			return this.data;
	}
	
	setData(data){
		if (this.data != "" && data == "") {this.erase = true; }else if(data != "" && this.erase){ this.erase=false; }
			
		if(data != this.data ) this.data = data; else this.erase=false;
	}

color(saturation){ 

	if(this.data == "") return "#677999"+Number(saturation).toString(16); 
		
	//console.clear();
var F = 442;
var n = 888;
for (var i = 0; i < this.data.length; i++) {
	var ol_F = F;
    if(codex.indexOf(this.data.charAt(i)) % 2 == 0){ F--; }else if(codex.indexOf(this.data.charAt(i)) == -1){  F++;n++; }else if(['&',';','<',' '].includes(this.data.charAt(i))){ F++;}else{ n++;}
	
	if(F== 441 && ol_F<F ||F==439 && ol_F>F){
		
		n--;
	}else if (F==440 && ol_F ==F){
		n-=2;
	}
	
	if(n>1000) {n = 888; F= ol_F+ (ol_F%12);}
	
	console.log("#"+(0xFFF000+n).toString(16));
}

console.log(F+" -- "+n);

this.final_F =F;
this.final_n = n;

var greenblue = (4095 - F + parseInt(n,16)).toString(16);
var computedColor =(parseInt(greenblue,16)-Math.abs(440-F)*n);

var clr = mod(computedColor,255).toString(16)+greenblue;

clr = Math.ceil((parseInt(clr,16) / 256)* (255-Math.abs(440-F))).toString(16);
console.log(clr);

return "#"+clr+Number(saturation).toString(16);
}

sound(volume){
	
if(this.erase) {var tmp= this.final_F; this.final_F=this.final_n; this.final_n=tmp;} //swaps final_F and final_n
if(volume>0){
	var context = new (window.AudioContext || window.webkitAudioContext)();
	
	if(volume<1){
		var gain0 = context.createGain();
		gain0.gain.value = volume;
		gain0.connect(context.destination);//console.log(gain0.);
	}
	
	var oscillator = context.createOscillator();
	oscillator.type = 'square';
	oscillator.frequency.value = this.final_F;
	oscillator.frequency.setValueAtTime(this.final_n,context.currentTime + 0.05);
	
	if (gain0) oscillator.connect(gain0); else oscillator.connect(context.destination);
	

oscillator.start(context.currentTime);
oscillator.stop(context.currentTime+0.1);
setTimeout(()=>context.close(),300);
}
}
	
};