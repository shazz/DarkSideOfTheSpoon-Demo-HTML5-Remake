/* -----

	Object Entities
		
	------			*/

	/************************************************************************************/
	/*																					*/
	/*			a player entity															*/
	/*																					*/
	/************************************************************************************/
	var MainEntity = me.ObjectEntity.extend(
	{	

		init:function (x, y, settings)
		{
			// define this here, since not defined in tiled
			settings.image = "sprites";
			settings.spritewidth = 64;
			settings.spriteheight = 64;
			
			// call the constructor
			this.parent(x, y, settings);
			
			// set h/v velocity
			this.setVelocity(6, 2);
			this.setMaxVelocity(6, 4);
			
			// add friction
			this.setFriction(0.5);
			
			if (jsApp.entityPos != null) {
				this.pos.x = jsApp.entityPos.x;
				this.pos.y = jsApp.entityPos.y;
			}

			// set the display to follow our position on both axis
			me.game.viewport.follow(this.pos);
			
			// walking animation
			this.addAnimation ("walk",  [4,5,6,7]);
			
			// flying animation
			this.addAnimation ("fly",  [8,9,10,11]);
			
			// set default one
			this.setCurrentAnimation("walk");
			
			// adjust animation timing
			this.animationspeed = me.sys.fps / 10;
			
			// adjust the collision box
			this.updateColRect(-2, 64, 30, 34);
			
			
			
			
		},
	
		
		/* -----

			update the player pos
			
		------			*/
		update : function ()
		{
				
			if (me.input.isKeyPressed('left'))
			{
				this.vel.x -= this.accel.x * me.timer.tick;
				// flip the sprite
				this.flipX(true);
			}
			else if (me.input.isKeyPressed('right'))
			{
				this.vel.x += this.accel.x * me.timer.tick;
				// unflip the sprite
				this.flipX(false);
			}
			
			if (me.input.isKeyPressed('fly'))
			{	
				this.vel.y -= this.accel.y * me.timer.tick;						
			}
			
			
			// check & update player movement
			this.updateMovement();
			
			// check for collision with sthg
			me.game.collide(this);
			// actually we can also check here when we collide with 
			// doors, by checking the object return by the function.

			
			
			// if flying
			if (me.input.keyStatus('fly'))
			{	
				// change animatiom if necessary
				if (!this.isCurrentAnimation("fly"))
				{
				 	this.setCurrentAnimation("fly");
				}
			}
			//falling
			if(this.vel.y != 0)
			{
				this.setCurrentAnimation("fly");
			}
			
			// walking
			else if (!this.setCurrentAnimation("walk") && (this.vel.y ==0))
			{
				//this.setCurrentAnimation("walk");	
			}
			
			
			// check if entity is moving
			if (this.vel.x!=0||this.vel.y!=0)
			{
				this.parent(this);
				return true;
			}
			
			return false;
		}

	});

	/*****************************************
	 *										 *
	 *			a door entity				 *
	 *										 *
	 *****************************************/
	var DoorEntity = me.InvisibleEntity.extend(
	{	
		init:function (x, y, settings)
		{
			// call the constructor
			this.parent(x, y, settings);
			
			// settings.demo_name was defined in Tiled
			this.demo_name = settings.demo_name;
		},	

		// collision notification, something (obj) touched the door !
		onCollision : function (res, obj)
		{
			if (me.input.isKeyPressed('enter'))
			{
				// save the player last pos
				
				jsApp.entityPos = obj.pos.clone();
				//console.log("knock knock " + this.demo_name + "!");
				me.state.change(jsApp.ScreenID.INTRO);
			}
		},
		
	});
	
	/*****************************************
	 *										 *
	 *			a door entity				 *
	 *										 *
	 *****************************************/
	var OverlayObject = me.InvisibleEntity.extend({
    
		init: function(x, y) 
		{
			// call the parent constructor
			this.parent(x, y, {width:me.game.currentLevel.realwidth, height:me.game.currentLevel.realheight});
			
			// CODEF CODE
			
			// reuse melonJS main canvas
			this.maincanvas = new canvas(me.video.getScreenCanvas());
			
		
			// END CODEF CODE
		},
		
		update : function() 
		{
			return true;
		},
		
		
		draw: function(context) 
		{
			// CODEF CODE
			
			this.maincanvas.contex.fillStyle = "#000000";
			this.maincanvas.contex.fillRect (0, 0, 768, 14);  
			this.maincanvas.contex.fillRect (0, 494, 768, 540);  
			
			// END CODEF CODE
		}
	  
	});


