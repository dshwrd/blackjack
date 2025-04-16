Blackjack
By: Daniel Howard

A simple Blackjack game made to demonstrate my understanding of object-oriented programming, data structures, and game logic implementation.

Instructions to run:

**yarn install**<br />
This command will install all dependencies to run the game.

**yarn dev**<br />
This will setup the server for testing, it'll provide a link you can control-click on to open in a browser.
Or just go to this address: http://localhost:5173/
<br /><br />
The game is built using TypeScript, Three.js, and CSS2DRenderer.

**TypeScript**<br />
TypeScript was used for all the game logic. I decided to use this... because it was required by the test.

**Three.js**<br />
Three.js was used for rendering the graphics on the screen. The scene is a 3D scene using an OrthographicCamera. I decided to use Three.js because of my past experience with it and because it makes animating 3D cards really easy (so you can flip them with a tween engine, etc).

**CSS2DRenderer**<br />
CSS2DRenderer was used for the Ui of the game. It allows us to render 2D (HTML) elements (Labels, buttons, etc) in the 3D Space. I decided to use the CSS2DRenderer because I had never used it before. I read about it and it caught my interest, so I wanted to test it out and see how it worked. I think it worked wonderfully for this test. I'd definitely use it again.
<br /><br />
I went with each event having it's own file, because of my past experiences. It might be a bit overkill for this test, could have just used an event class and threw them all in there. But, in a production level game, with possibly 100s of events, I think each having their own file is nice, clean, and easier to maintain.
<br /><br />
For this test, I specifically used console.log for all of my logs. In a real game, I'd have implemented a logger (Log4js) for proper logging.