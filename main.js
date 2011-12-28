/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   DSOTS Demo HTML5 Remake
 *
 **/


var jsApp	= 
{	
	// Screen ID when changing state
	ScreenID : {
		INTRO : 100, // start at 100 on purpose
	},
	
	// last entity position
	entityPos : null,
	
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		
		// init the video
		if (!me.video.init('jsapp', 768, 540, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
			return;
		}
		
		// force a viewport with a smaller size
		me.game.init(768,480);
				
		// initialize the "audio"
		me.audio.init("ogg");
			
		// get a ref to the canvas
		var ctx = me.video.getScreenFrameBuffer();
		// clear surface
		me.video.clearSurface(ctx, "black");
		// display a centered "please wait"
		var font = new me.Font('courier', 11, 'white');
		var dim  = font.measureText(ctx, 'PLEASE WAIT');
		font.draw(ctx, 'PLEASE WAIT', ((ctx.canvas.width - dim.width) / 2),  (ctx.canvas.height) / 2);
						
		// set all resources to be loaded
		me.loader.onload = jsApp.loaded.bind(jsApp);

		// set all resources to be loaded
		me.loader.preload(g_resources);

		// set our custom loader
		me.state.set(me.state.LOADING, new DSOTSLoader());

		// load everything & display the loading screen
		me.state.change(me.state.LOADING);

	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()
	{
		
		
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
		
		// register the various screen;
		// DemoIntro
		//me.state.set(jsApp.ScreenID.INTRO, new DemoIntro());
		
		// start the game 
		me.state.change(me.state.PLAY);
		
		// add our player entity in the entity pool
		me.entityPool.add("MainEntity", MainEntity);
		// add our door entity in the entity pool
		me.entityPool.add("DoorEntity", DoorEntity);
		
		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,  "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP,    "fly");
		// bind the space key, and avoid key repetition
		me.input.bindKey(me.input.KEY.SPACE, "enter", true);
		// bind the ESC key, to exit demo
		me.input.bindKey(me.input.KEY.ESC, "exit");
		
		// debug stuff
		//me.debug.renderHitBox = true;
		
		
		
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{
	
	init: function()
	{	
		this.parent(false)
		// init the YM Player
		this.YMPlayer = new music("YM");		
	},
	
	onResetEvent: function()
	{	
		// use setInterval
		me.sys.useNativeAnimFrame = false;
		
		// load a level
		me.levelDirector.loadLevel("menu");
		
		// add the ball object
		me.game.add(new OverlayObject(1, 1),999);
		me.game.sort();

		
		// start the main menu music 
		// there is no just a Load function ?
		//this.YMPlayer.LoadAndRun('data/music/Cuddly - main menu.ym');
		// reconnect if we disconnect previously
		//if (this.YMPlayer.player != null) {
		//	CODEF_AUDIO_NODE.connect(CODEF_AUDIO_CONTEXT.destination);
		//}
	},
	
	
	/* ---
	
		 action to perform when game is finished (state change)
		
		---	*/
	onDestroyEvent: function()
	{
		if (this.YMPlayer.player != null) {
			// stop the menu music
			// is this the right way ?
			CODEF_MUSICPLAYER.stop();
			CODEF_AUDIO_NODE.disconnect();
		}
	}

});


//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});
