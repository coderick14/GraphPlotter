
//graphNodes : array of objects to store information about nodes
var graphNodes = [];

//function to initialize the graph
//connections : adjacency list for a particular node
function initGraph()	{
	for(var i=0;i<num_nodes;i++)	{
		var obj = {visited : false,connections : []};
		graphNodes.push(obj);
	}
}
function explore(i)	{
	graphNodes[i].visited = true;
	console.log(i+1);			//prints the order of Depth-First traversal to the console
	for(var j=0;j<graphNodes[i].connections.length;j++)	{
		if(!graphNodes[graphNodes[i].connections[j]].visited)	{
			explore(graphNodes[i].connections[j]);
		}
	}
}

//function to implement Depth-First Traversal
function dfs()	{

	console.log("start dfs");
	for(var i=0;i<num_nodes;i++)	{
		if(!graphNodes[i].visited)	{
			explore(i);
		}
	}
}

//function to implement Breadth-First Traversal
function bfs(start)	{
	var queue = [],poppedNode;
	start-=1;
	for(var j=0;j<num_nodes;j++)	{
		graphNodes[j].visited = false;
	}
	console.log("start bfs");
	queue.push(start);
	graphNodes[start].visited = true;
	while(queue.length!=0)	{

		poppedNode = queue[0];
		console.log(poppedNode+1); 		//prints the order of traversal to the console
		queue.shift();
		for(var j=0;j<graphNodes[poppedNode].connections.length;j++)	{
			if(!graphNodes[graphNodes[poppedNode].connections[j]].visited)	{
				queue.push(graphNodes[poppedNode].connections[j]);
				graphNodes[graphNodes[poppedNode].connections[j]].visited = true;
			}

		}
	}

}



//////----------------------------------------///////////////////
