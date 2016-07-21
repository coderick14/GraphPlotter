var canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext('2d');

	//canvas for drawing minimum spanning tree
	var canvasMST = document.getElementById('canvasMST');
	canvasMST.width = window.innerWidth;
	canvasMST.height = window.innerHeight;
	var ctxMST = canvasMST.getContext('2d');	

	/*num_nodes : No of nodes entered by the user
	  num_edges : No of edges entered by the user
		edgesArray : Stores the user input for adjacent nodes
		count : Stores the number of edges between a pair of nodes
		countEdgesEntered : Keeps track of the number of edges entered by the user. Incremented after each input*/
	var num_nodes,num_edges,edgesArray=[],count=[],count1 = [],count2 = [];
	var countEdgesEntered = 1;
	var bfsStart=1;

	//Function to receive user input for number of nodes and edges and validate it
	function getEdges()	{

		var options = "";		//the innerHTML for the select tag
		num_nodes = document.getElementById('nodes').value;
		num_edges = document.getElementById('edges').value;
		initGraph();				//initializes the graph with visited values as false and an empty adjacency list for each node
		for(var i=0;i<num_nodes;i++)	{
			options+="<option value="+(i+1)+">"+(i+1)+"</option>";
		}
		//user input validation
		if(num_nodes == "" || num_edges == "" || num_nodes <0 || num_edges<0)	{
			alert("Invalid Input");
			location.reload();
		}
		if(num_nodes == 0)	{
			alert("Empty graph!! Enter at least one node!!");
			location.reload();
		}
		if(num_edges!=0)	{
			document.getElementById('edgeBeginValues').innerHTML = options;
			document.getElementById('edgeEndValues').innerHTML = options;
			document.getElementById('bfsInput').innerHTML = options;
			document.getElementById('btn2').innerHTML = "Submit values for edge 1";
			document.getElementById('showNext').style.display = "block";
		}
		else	{
			/*if number of edges is zero, proceed to draw the graph without taking any further input. Just draw the nodes*/
			drawGraph();
		}

	}

		//Function which is called every time the user submits a new edge entry
	function getNextEdge()	{

		var initialVertex = document.getElementById('edgeBeginValues').value;
		var terminalVertex = document.getElementById('edgeEndValues').value;
		var weight = document.getElementById('edgeWeight').value;

		//push the values into the adjacency list for the graph
		graphNodes[initialVertex-1].connections.push(terminalVertex-1);
		//graphNodes[initialVertex-1].weights.push(weight);

		//the following if block gets executed only for undirected graphs 
		if (document.getElementById('undi').checked)	{
			graphNodes[terminalVertex-1].connections.push(initialVertex-1);
			//graphNodes[terminalVertex-1].weights.push(weight);
			if(initialVertex!=terminalVertex)   {
	     		//console.log("yay  "+initialVertex+"   "+terminalVertex);
				for(var i=0;i<weightList.length;i++)
				{
					if(((weightList[i].src==initialVertex)&&(weightList[i].dest==terminalVertex))||((weightList[i].src==terminalVertex)&&(weightList[i].dest==initialVertex)))
					{
						if(weightList[i].wgt>weight)
							weightList[i].wgt=weight;
						break;
					}
				}
				if(i==weightList.length)
				weightList.push({"wgt" : weight,"src" : initialVertex,"dest" : terminalVertex});
     		}

     		if(edgesArray.length == 0)	{
				edgesArray.push(initialVertex);
				edgesArray.push(terminalVertex);
				count[0] = 1;
			}
			else	{
				for(var i=0;i<edgesArray.length;i++)	{
					//the following if block checks if multiple edges are there
					if(edgesArray[i] == initialVertex)	{
						if((i%2==0 && edgesArray[i+1]==terminalVertex)||(i%2==1 && edgesArray[i-1]==terminalVertex))	{
							count[Math.floor(i/2)]++;
							break;
						}
					}
				}
				if(i==edgesArray.length)	{
					count.push(Number(1));
					edgesArray.push(initialVertex);
					edgesArray.push(terminalVertex);
				}
			}	
		}
		// if graph is directed
		else {
			if(edgesArray.length == 0)	{
				edgesArray.push(initialVertex);
				edgesArray.push(terminalVertex);
				count1[0] = 1;
				count2[0] = 0;
			}
			else	{
				for(var i=0;i<edgesArray.length;i++)	{

					//the following if block checks if multiple edges are present
					if(edgesArray[i] == initialVertex)	{
						if(i%2==0 && edgesArray[i+1]==terminalVertex)	{
							count1[Math.floor(i/2)]++;
							break;
						}
						else if(i%2==1 && edgesArray[i-1]==terminalVertex){
							count2[Math.floor(i/2)]++;
							break;
						}
					}
				}
				if(i==edgesArray.length)	{
					count1.push(Number(1));
					count2.push(Number(0));
					edgesArray.push(initialVertex);
					edgesArray.push(terminalVertex);
				}
			}

		}

		if(countEdgesEntered == num_edges)	{
			//if all the edges have been entered, proceed to drawing graph
			//document.getElementById("bfsMsg").style.display="block";
			//document.getElementById("bfsInput").style.display="block";

			//document.getElementById("bfsInputTaken").style.display = "block";
			//document.getElementById("bfsInputTaken").addEventListener('click', function() {
				bfsStart = document.getElementById("bfsInput").value;
				drawGraph();
			}

		else	{
			//increment the number of edges entered
			countEdgesEntered++;
			document.getElementById('btn2').innerHTML = "Submit values for edge "+countEdgesEntered;
		}
	}


	var points = [];

	function drawGraph()	{
		document.getElementById('takeInput').style.display = "none";
		canvas.style.display = "block";

		/*semiMajorAxis : semi major axis of ellipse on which the nodes will be plotted
		semiMinorAxis : semi major axis of ellipse on which the nodes will be plotted
		theta : angle between successive nodes(with respect to director circle)
		centerX,centerY : coordinates for center of the canvas
		points : array to store the coordinates of the nodes*/
		var semiMajorAxis = canvas.width/2 - 30,semiMinorAxis = canvas.height/2 - 30;
		var theta = 2*Math.PI/num_nodes;
		var angle = theta;
		var centerX = canvas.width/2,centerY = canvas.height/2;
		points.push(centerX + semiMajorAxis);
		points.push(centerY);		//coordinates for first node stored

		//stores the coordinates of all the nodes into points array
		for(var i=0;i<num_nodes-1;i++)	{
			var x_next = centerX + semiMajorAxis*Math.cos(angle);
			var y_next = centerY - semiMinorAxis*Math.sin(angle);
			points.push(x_next);
			points.push(y_next);
			angle+=theta;
		}

		if (document.getElementById('undi').checked)	{
			
			for(var i=0;i<edgesArray.length;i+=2) {

				//if there are loops in the graph(where initial and terminal vertex refer to the same node)
				if(edgesArray[i] == edgesArray[i+1])	{
					var radiusLoop = 20;			//radius of the loop
					for(var j=0;j<count[i/2];j++)	{
						ctx.beginPath();
						ctx.arc(points[2*edgesArray[i]-2]+radiusLoop*Math.cos(theta*(edgesArray[i]-1)),points[2*edgesArray[i]-1]+radiusLoop*Math.sin(theta*(edgesArray[i]-1)),radiusLoop,0,2*Math.PI);
						ctx.stroke();
						radiusLoop+=10;
					}
				}
				//when the initial and terminal vertex are distinct
				else {
					ctx.beginPath();
					ctx.moveTo(points[2*edgesArray[i]-2],points[2*edgesArray[i]-1]);
					ctx.lineTo(points[2*edgesArray[i+1]-2],points[2*edgesArray[i+1]-1]);
					ctx.stroke();

					//checks if there are multiple edges between these nodes
					if(count[i/2]>1) {

						/*midX,midY : midpoint of the initialVertex and terminalVertex
							alpha : slope of normal to the line joining the nodes
							sinAlpha,cosAlpha : sine and cosine values for alpha respectively
							height : perpendicular distance of control point from the (midX,midY)*/
						var midX = (points[2*edgesArray[i]-2] + points[2*edgesArray[i+1]-2])/2;
						var midY = (points[2*edgesArray[i]-1] + points[2*edgesArray[i+1]-1])/2;
						var alpha = Math.atan2(points[2*edgesArray[i]-2] - points[2*edgesArray[i+1]-2], points[2*edgesArray[i+1]-1] - points[2*edgesArray[i]-1]);
						var sinAlpha = Math.sin(alpha);
						var cosAlpha = Math.cos(alpha);
						var height = 50;
						for(var j=0;j<count[i/2]-1;j++)	{
							//draw the multiple edges
							ctx.beginPath();
							ctx.moveTo(points[2*edgesArray[i]-2],points[2*edgesArray[i]-1]);
							ctx.quadraticCurveTo(midX + height*cosAlpha, midY + height*sinAlpha,points[2*edgesArray[i+1]-2],points[2*edgesArray[i+1]-1]);
							sinAlpha = -sinAlpha;
							cosAlpha = -cosAlpha;
							if(j%2==1) {
								height += 50;
							}
							ctx.stroke();

						}
					}
				}
			}
		}
		// for directed graph
		else {
			for(var i=0;i<edgesArray.length;i+=2) {


				//if there are loops in the graph(where initial and terminal vertex refer to the same node)
				if(edgesArray[i] == edgesArray[i+1])	{
					var radiusLoop = 20;			//radius of the loop
					for(var j=0;j<count1[i/2];j++)	{
						ctx.beginPath();
						ctx.arc(points[2*edgesArray[i]-2]+radiusLoop*Math.cos(theta*(edgesArray[i]-1)),points[2*edgesArray[i]-1]+radiusLoop*Math.sin(theta*(edgesArray[i]-1)),radiusLoop,0,2*Math.PI);
						ctx.stroke();
						radiusLoop+=10;
					}
				}
				//when the initial and terminal vertex are distinct
				else {

					/*midX,midY : midpoint of the initialVertex and terminalVertex
						beta : slope of the line joining the nodes
						alpha : slope of normal to the line joining the nodes*/
					var midX = (points[2*edgesArray[i]-2] + points[2*edgesArray[i+1]-2])/2;
					var midY = (points[2*edgesArray[i]-1] + points[2*edgesArray[i+1]-1])/2;
					var alpha = Math.atan2(points[2*edgesArray[i]-2] - points[2*edgesArray[i+1]-2], points[2*edgesArray[i+1]-1] - points[2*edgesArray[i]-1]);
					var beta = alpha - (Math.PI/2);

					ctx.beginPath();
					ctx.moveTo(points[2*edgesArray[i]-2],points[2*edgesArray[i]-1]);
					ctx.lineTo(points[2*edgesArray[i+1]-2],points[2*edgesArray[i+1]-1]);
					ctx.stroke();

					//draw the arrowhead to indicate direction of the edge
					ctx.translate(midX,midY);
					ctx.rotate(beta);
					ctx.moveTo(0, 0);
					ctx.lineTo(20*Math.cos(Math.PI/6), 20*Math.sin(Math.PI/6));
					ctx.moveTo(0,0);
					ctx.lineTo(20*Math.cos(Math.PI/6), 20*Math.sin(-Math.PI/6))
					ctx.stroke();
					ctx.rotate(-beta);
					ctx.translate(-midX,-midY);


					if((count1[i/2]>1)||(count2[i/2]>0)) {
						//draw the multiple edges
						/*sinAlpha,cosAlpha : sine and cosine values for alpha respectively
						height : perpendicular distance of control point from the (midX,midY)
						ctrlX,ctrlY : coordinates of the control point for the quadratic curve*/
						var sinAlpha = Math.sin(alpha);
						var cosAlpha = Math.cos(alpha);
						var height = 50;
						var ctrlX= midX + height*cosAlpha;
						var ctrlY= midY + height*sinAlpha;

						var j = 0;
						for(var k=0;k<count1[i/2]-1;k++)	{

							ctx.beginPath();
							ctx.moveTo(points[2*edgesArray[i]-2],points[2*edgesArray[i]-1]);
							ctx.quadraticCurveTo(ctrlX, ctrlY,points[2*edgesArray[i+1]-2],points[2*edgesArray[i+1]-1]);
							sinAlpha = -sinAlpha;
							cosAlpha = -cosAlpha;

							if(j%2==1) {
								height += 50;
							}

							ctx.stroke();
							//arrowPointX,arrowPointY : midpoint of curve, where the arrowhead is to be drawn
							var arrowPointX = (ctrlX + midX)/2;
							var arrowPointY = (ctrlY + midY)/2;

							//draw the arrowhead
							ctx.translate(arrowPointX,arrowPointY);
							ctx.rotate(beta);
							ctx.moveTo(0, 0);
							ctx.lineTo(20*Math.cos(Math.PI/6), 20*Math.sin(Math.PI/6));
							ctx.moveTo(0,0);
							ctx.lineTo(20*Math.cos(Math.PI/6), 20*Math.sin(-Math.PI/6))
							ctx.stroke();
							ctx.rotate(-beta);
							ctx.translate(-arrowPointX,-arrowPointY);

							//update the control point to draw the next multiple edge
							ctrlX = midX + height*cosAlpha;
							ctrlY = midY + height*sinAlpha;
							j++;

						}

						//draw the oppositely directed edges
						for(var k=0;k<count2[i/2];k++)
						{
							ctx.beginPath();
							ctx.moveTo(points[2*edgesArray[i]-2],points[2*edgesArray[i]-1]);
							ctx.quadraticCurveTo(ctrlX, ctrlY,points[2*edgesArray[i+1]-2],points[2*edgesArray[i+1]-1]);
							sinAlpha = -sinAlpha;
							cosAlpha = -cosAlpha;
							if(j%2==1) {
								height += 50;
							}
							ctx.stroke();

							//arrowPointX,arrowPointY : midpoint of curve, where the arrowhead is to be drawn
							var arrowPointX = (ctrlX + midX)/2;
							var arrowPointY = (ctrlY + midY)/2;

							//draw the arrowhead
							ctx.translate(arrowPointX,arrowPointY);
							ctx.rotate(beta);
							ctx.moveTo(0, 0);
							ctx.lineTo(20*Math.cos(5*Math.PI/6), 20*Math.sin(5*Math.PI/6));
							ctx.moveTo(0,0);
							ctx.lineTo(20*Math.cos(5*Math.PI/6), 20*Math.sin(-5*Math.PI/6))
							ctx.stroke();
							ctx.rotate(-beta);
							ctx.translate(-arrowPointX,-arrowPointY);

							//update the control point to draw the next multiple edge
							ctrlX = midX + height*cosAlpha;
							ctrlY = midY + height*sinAlpha;

							j++;
						}
					}
				}
			}
		}

		dfs();
		bfs(Number(bfsStart));
		if (document.getElementById('undi').checked) {

			var isMSTPossible = kruskal();
			if(isMSTPossible)	{
				drawMST();	
			}
			else 	{
				traversalData += "<h2>MST is not possible for the entered graph</h2>";
				document.getElementById('traversalData').innerHTML = traversalData;
			}
			
		}

		//draw the nodes
		for(var i=0;i<2*num_nodes;i+=2)	{
			ctx.beginPath();
			ctx.fillStyle = "red";
			ctx.arc(points[i],points[i+1],15,0,2*Math.PI);
			ctx.fill();
			ctx.fillStyle = "yellow";
			ctx.font = "20px Georgia";
			ctx.fillText(i/2+1,points[i]-5,points[i+1]+5);
		}
	}

	function drawMST()	{
		console.log("Inside drawMST");
		ctxMST.beginPath();
		ctxMST.strokeStyle = "green";
		ctxMST.lineWidth = 2;
		for(var k =0;k<num_nodes;k++)	{
			ctxMST.moveTo(points[2*k],points[(2*k)+1]);
			for(var l=0;l<mst[k].connections.length;l++){
				ctxMST.lineTo(points[2*mst[k].connections[l]],points[(2*mst[k].connections[l])+1]);
				ctxMST.moveTo(points[2*k],points[(2*k)+1]);
			}
		}
		ctxMST.stroke();
		
		for(var i=0;i<2*num_nodes;i+=2)	{
			ctxMST.beginPath();
			ctxMST.fillStyle = "red";
			ctxMST.arc(points[i],points[i+1],15,0,2*Math.PI);
			ctxMST.fill();
			ctxMST.fillStyle = "yellow";
			ctxMST.font = "20px Georgia";
			ctxMST.fillText(i/2+1,points[i]-5,points[i+1]+5);
		}
		canvasMST.style.display = "block";
	}
	
