
var cv = document.getElementById('cv');
var context = cv.getContext('2d');

var d = 100;

function drawLine(pi,pf)
{
    context.beginPath();
    context.moveTo(pi[0],pi[1]);
    context.lineWidth = 5;
    context.strokeStyle = '#000000';
    context.stroke();
}

function drawColorLine(pi,pf,color)
{
    context.beginPath();
    context.moveTo(pi[0],pi[1]);
    context.lineTo([0],pf[1]);
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.stroke();
}
function drawCircle(p,r)
{
    context.beginPath();
    context.ellipse(p[0], p[1], r, r, Math.PI/4, 0, 2*Math.PI);
    context.stroke();
}
function drawGrid()
{
    context.beginPath();
    context.fillStyle = "#FFFFFF";
    context.fillReact(0,0,d*3,d*3);
    context.stroke();

    for(var i=0; i<=3;i++)
    {
        var x = i*d;
        drawLine([x,0], [x, d*3]);
    }

    for(var j=0; j<=3;j++)
    {
        var y = j*d;
        drawLine([0,y], [d*3,y]);
    }

}
function drawX(col,lin)
{
	var x = col*d, y = lin*d, x1 = (col+1)*d, y1 = (lin+1)*d;
	var bound = 20;
	drawLine([x+bound,y+bound], [x1-bound,y1-bound]);
	drawLine([x1-bound,y+bound], [x+bound,y1-bound]);  	
}

function drawO(col,lin)
{
	var x = col*d + d/2, y = lin*d + d/2;
	var r = 30;
	drawCircle([x,y],r);  	
}

function resetGrid()
{
	drawGrid();
}

// state functions

var currentState = [ ['','',''], ['','',''], ['','',''] ]; 
var gameReseted = false;
var gameEnd = false;

function stateIsFull(state) // returns true or false
{
	for(var c=0; c<3; c++)
	{
		for(var l=0; l<3; l++)
		{
			if(state[c][l] == '') return false; 
		}
	}
	return true;
}


function resetGame()
{
	currentState = [ ['','',''], ['','',''], ['','',''] ];
	gameReseted = true;
	gameEnd = false;
	resetGrid();
}

function forEachGap(state, callback)
{
	for(var c=0; c<3; c++)
	{
		for(var l=0; l<3; l++)
		{
			if(state[c][l] == '')
			{ 
				callback(c,l);
			}
		}
	}
}

function cloneState(state)
{
	var new_state = [ ['','',''], ['','',''], ['','',''] ];
	for(var c=0;c<3;c++)
	{
		for(var l=0;l<3;l++)
		{
			new_state[c][l] = state[c][l];
		}	
	}
	return new_state;
}

function stateX(state, col,lin) //retornar uma nova matriz de estado com um X
{
	var new_state = cloneState(state);
	new_state[col][lin] = 'x';
	return new_state;
}

function stateO(state, col,lin) ///retorna um novo array de estado com um O
{

	var new_state = cloneState(state);
	
	new_state[col][lin] = 'o';
	return new_state;
}

function drawState(state)
{
	resetGrid();

	for(var c=0;c<3;c++)
	{
		for(var l=0;l<3;l++)
		{
			if(state[c][l] == 'x') drawX(c,l);
			else if(state[c][l] == 'o') drawO(c,l);
		}
	}
}

function whoWin(state)  
{

	// -------- O wins ? ----------
	// estrategicamente, o rival deve ser analisado primeiro

	//diags
	if(state[0][0] == 'o' && state[1][1] == 'o' && state[2][2] == 'o') return 'o';
	if(state[2][0] == 'o' && state[1][1] == 'o' && state[0][2] == 'o') return 'o';

	for(var c=0; c<3; c++)
	{
		if(state[c][0] == 'o' && state[c][1] == 'o' && state[c][2] == 'o') return 'o';
	}

	for(var l=0; l<3; l++)
	{
		if(state[0][l] == 'o' && state[1][l] == 'o' && state[2][l] == 'o') return 'o';
	}

	// X wins ?

	if(state[0][0] == 'x' && state[1][1] == 'x' && state[2][2] == 'x') return 'x';	
	if(state[2][0] == 'x' && state[1][1] == 'x' && state[0][2] == 'x') return 'x';

	for(var c=0; c<3; c++)
	{
		if(state[c][0] == 'x' && state[c][1] == 'x' && state[c][2] == 'x') return 'x';
	}

	
	for(var l=0; l<3; l++)
	{
		if(state[0][l] == 'x' && state[1][l] == 'x' && state[2][l] == 'x') return 'x';
	}

	return '';
}

function detectEnd()
{
	if( (currentState[0][0] == 'o' && currentState[1][1] == 'o' && currentState[2][2] == 'o') 
		|| (currentState[0][0] == 'x' && currentState[1][1] == 'x' && currentState[2][2] == 'x') )
	{
		console.log('line formed in main diagonal');
		gameEnd = true;
		drawColorLine([0,0], [d*3,d*3], '#FF0000'); 
	}

	if( (currentState[2][0] == 'o' && currentState[1][1] == 'o' && currentState[0][2] == 'o') 
		|| (currentState[2][0] == 'x' && currentState[1][1] == 'x' && currentState[0][2] == 'x') )
	{
		console.log('line formed in secondary diagonal');
		gameEnd = true;
		drawColorLine([d*3,0], [0,d*3], '#FF0000');
	}

	
	for(var c=0; c<3; c++)
	{
		if( (currentState[c][0] == 'x' && currentState[c][1] == 'x' && currentState[c][2] == 'x') 
			|| (currentState[c][0] == 'o' && currentState[c][1] == 'o' && currentState[c][2] == 'o') )
		{
			console.log('line formed in column=' + c);
			gameEnd = true;
			drawColorLine([d*c+d/2, 0], [d*c+d/2, d*3], '#FF0000') 
		}
	}

	for(var l=0; l<3; l++)
	{
		if( (currentState[0][l] == 'x' && currentState[1][l] == 'x' && currentState[2][l] == 'x')
			|| (currentState[0][l] == 'o' && currentState[1][l] == 'o' && currentState[2][l] == 'o') )
		{
			console.log('line formed in line=' + l);
			gameEnd = true;
			drawColorLine([0, d*l+d/2],[d*3, d*l+d/2], '#FF0000'); 
		}
	}

	if(stateIsFull(currentState) == true)
	{ 
		console.log('all gaps were filled');
		gameEnd = true;
	}
}


//IA agent



const playerO = false;
const playerX = true;

function minmax(state, player)
{
	var winner = whoWin(state);
	if(winner != '' || stateIsFull(state)) return (winner == '' ? [0,NaN,NaN] : (winner == 'x' ? [1,NaN,NaN] : [-1,NaN,NaN]) );

	if(player == playerO)
	{
		var maxFound = -2;
		var c_found, l_found;

		forEachGap(state,function(c,l)
		{
			var currentV, currentC, currentL;
			[currentV, NaN, NaN] = minmax(stateX(state,c,l), !player);
			if(currentV > maxFound) [maxFound, c_found, l_found] = [currentV, c, l];
		});

		return [maxFound, c_found, l_found];
	}
	else //if(player == playerX)
	{
		var minFound = 2;
		var c_found, l_found;

		forEachGap(state,function(c,l)
		{
			var currentV, currentC, currentL;
			[currentV, NaN, NaN] = minmax(stateO(state,c,l), !player);
			if(currentV < minFound) [minFound, c_found, l_found] = [currentV, c, l];
		});

		return [minFound, c_found, l_found];
	}

}

function bestX(state) 
{	
	var bestC, bestL;
	[NaN, bestC, bestL] = minmax(state, playerO);
	return [bestC, bestL];
}

function detectCL(x,y)
{
	return [ x/d|0, y/d|0]; 
}




function randomMove()
{
	do
	{
		xc = (Math.random()*100|0)%3;
		xl = (Math.random()*100|0)%3;
		console.log("loop:" + [xc,xl]);
	}while(currentState[xc][xl] != '');

	console.log('AI randomly chose: ' + [xc,xl]);
	return [xc,xl];
}

var gameLocked = false;

cv.addEventListener('click', function(e)
{
	gameReseted = false;
	if(gameLocked == true) return;

	if(gameEnd == true)
	{
		alert('Game is over');
		return;
	}

	var x = e.pageX - cv.offsetLeft;
	var y = e.pageY - cv.offsetTop;
	var c,l;
	[c,l] = detectCL(x,y);
	if(currentState[c][l] == '')
	{
		
		console.log('User chose: ' + [c,l]);
		currentState[c][l] = 'o';
		drawState(currentState);

		detectEnd(); 
		if(gameEnd == true) return;

		gameLocked = true;

		setTimeout(function() 
		{

			if(gameReseted == true) return;
			
			var xc = -1, xl = -1;
			[xc,xl] = bestX(currentState);	
			console.log('AI chose: ' + [xc,xl]);

			if(xc != -1 && xl != -1) currentState[xc][xl] = 'x';
			else 
			{
				[xc,xl] = randomMove();
				currentState[xc][xl] = 'x';
			}

			drawState(currentState);
			detectEnd();
			gameLocked = false;

		}, 100);
	}	
});


// Reset button
var resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetGame);

drawGrid();

function bestX(state) // [col,lin] = bestX(state)
{
	//0.1 no caso 10% vai ser as melhores jagadas :D
	//caso queira aumentar a porcentagem, só aumentar o 0.1 para até 0.9
	if (Math.random() <0.1){
		var bestC, bestL;
		[NaN, bestC, bestL] = minmax(state, playerO);
		return [bestC, bestL];
	} else{
		//O resto dos movimentos vão ser aleatórios(90% no caso atual)
		return randomMove();
	}
}

