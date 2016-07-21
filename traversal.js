
//graphNodes : array of objects to store information about nodes

var graphNodes = [],weightList = [],mst = [],weightsToPrint = [];
var weightsToPrint1 = [],weightsToPrint2 = [];
var traversalData = "";
var bfsCounter = 0;

//function to initialize the graph
//connections : adjacency list for a particular node
function initGraph()	{
	for(var i=0;i<num_nodes;i++)	{
		var obj = {visited : false,connections : []};
		graphNodes.push(obj);
		var mstNode = {visited : false,connections : []};
		mst.push(mstNode);
	}
}

///////////////////////////////////////////////////////////////////DEPTH FIRST TRAVERSAL//////////////////////////////////////////////////////////////////////

function explore(i)	{
	graphNodes[i].visited = true;
	console.log(i+1);
	traversalData += (i+1)+"  ";			//prints the order of Depth-First traversal to the console
	for(var j=0;j<graphNodes[i].connections.length;j++)	{
		if(!graphNodes[graphNodes[i].connections[j]].visited)	{
			explore(graphNodes[i].connections[j]);
		}
	}
}

//function to implement Depth-First Traversal
function dfs()	{

	console.log("start dfs");
	traversalData += "The order for Depth-First Traversal is : <br>";
	for(var i=0;i<num_nodes;i++)	{
		if(!graphNodes[i].visited)	{
			explore(i);
		}
	}
	traversalData += "<br><br>";
}



////////////////////////////////////////////////////////////////////BREADTH FIRST TRAVERSAL///////////////////////////////////////////////////////////////
function bfs(start)	{
	var queue = [],poppedNode;
	start-=1;
	for(var j=0;j<num_nodes;j++)	{
		graphNodes[j].visited = false;
	}
	console.log("start bfs");
	traversalData += "The order for Breadth-First Traversal is : <br>";
	queue.push(start);
	graphNodes[start].visited = true;
	while(queue.length!=0)	{

		poppedNode = queue[0];
		console.log(poppedNode+1); 	
		traversalData += (poppedNode+1)+"  ";	//prints the order of traversal to the console
		bfsCounter++;                   //Changes made
		queue.shift();
		for(var j=0;j<graphNodes[poppedNode].connections.length;j++)	{
			if(!graphNodes[graphNodes[poppedNode].connections[j]].visited)	{
				queue.push(graphNodes[poppedNode].connections[j]);
				graphNodes[graphNodes[poppedNode].connections[j]].visited = true;
			}

		}
	}
	traversalData += "<br><br>";
	document.getElementById('traversalData').innerHTML = traversalData;

}

///////////////////////////////////////////////MINIMUM SPAANING TREE STARTS////////////////////////////////////////////////////////////////////////
var flag ;
var it;
var endnode;
function cycleSearch(startnode) {
	var it2=0;
if(startnode==endnode)
	flag=1;
else
{
	mst[startnode-1].visited = true;
	if(it==0)
		it2 =1;

	//console.log(i+1);			//prints the order of Depth-First traversal to the console
	for(var j=0;j<mst[startnode-1].connections.length;j++)	{
		if(it2==1)
		{
		if(mst[startnode-1].connections[j]==endnode-1)
			continue;
	     }
		if(!mst[mst[startnode-1].connections[j]].visited)	{
			it =1;
		  flag =  cycleSearch(mst[startnode-1].connections[j]+1);
		}
		if(flag==1)
			break;
	}	

}
return flag;
}

function kruskal()	{
	console.log("start kruskal");
	if(weightList.length!=0 && bfsCounter==num_nodes)	{
		weightList.sort(function(a,b) { return a.wgt-b.wgt;});
		mst[weightList[0].src-1].connections.push(weightList[0].dest-1);
		mst[weightList[0].dest-1].connections.push(weightList[0].src-1);
		var mstCount = 1;
		var counter = 1;
		while(counter<weightList.length)	{
			mst[weightList[counter].src-1].connections.push(weightList[counter].dest-1);
			mst[weightList[counter].dest-1].connections.push(weightList[counter].src-1);
			flag =0;
			it =0;
			endnode=weightList[counter].dest;
			 flag = cycleSearch(weightList[counter].src);
			 console.log(flag);
			if(flag)	{
				mst[weightList[counter].src-1].connections.pop();
				mst[weightList[counter].dest-1].connections.pop();
			}
			else	{
				mstCount++;
			}
			if(mstCount==num_nodes-1)
				break;
			counter++;
			for(var i=0;i<num_nodes;i++)	{
				mst[i].visited = false;
			}
			
		}
		if(mstCount==num_nodes-1)
		{
			console.log("spanning tree found");
			for(var k =0;k<num_nodes;k++)
			{
				console.log(k+1);
				console.log(" ");
				for(var l=0;l<mst[k].connections.length;l++){
					console.log(mst[k].connections[l]+1);
				}
				console.log(" ");
			}
		}

		return 1;
	}
	else {
		//what to show if mst is not possible
		return 0; 
	}
	
}


//////----------------------------------------///////////////////
