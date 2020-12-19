import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {game} from '../algorithms/game';
import {getMaze} from '../algorithms/getMaze';


import './PathfindingVisualizer.css';

var is_Start = false;
var is_Finish = false;
var prevRowStart,prevColStart,prevRowFinish,prevColFinish,prevClass;
var is_board_clear = true;
var is_game_on = false;
var visualizing = false

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      speed: 5,
      START_NODE_ROW: 0,
      START_NODE_COL: 0,
      FINISH_NODE_ROW: 20,
      FINISH_NODE_COL: 56,
      timer: 30,
      user_score: 0,
      gameWallsCount: 0,
      shortest_path: 0,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid(this.state.START_NODE_ROW,this.state.START_NODE_COL,this.state.FINISH_NODE_ROW,this.state.FINISH_NODE_COL);
    this.setState({grid});
  }

  // Handle Mouse Down works when we click
  handleMouseDown(row, col) {
    if(visualizing||!is_board_clear) return;

    if(row===this.state.START_NODE_ROW&&col===this.state.START_NODE_COL)
    {
      if(is_game_on)return;
      is_Start=true;
      prevClass='node';
      prevRowStart=row;
      prevColStart=col;
      return;
    }
    if(row===this.state.FINISH_NODE_ROW&&col===this.state.FINISH_NODE_COL)
    {
      if(is_game_on)return;
      is_Finish=true;
      prevRowFinish=row;
      prevColFinish=col;
      return;
    }
    if(is_game_on)
    {      
      const {grid} = this.state;
      const node = grid[row][col];  
      if(node.isWall) return;   
      var newGameWallsCount;
      if(node.isGameWall)
        newGameWallsCount = this.state.gameWallsCount - 1;
      else
        newGameWallsCount = this.state.gameWallsCount + 1;
      const newGrid = getNewGridWithWallToggledGame(this.state.grid, row, col);      
      this.setState({grid: newGrid, mouseIsPressed: true, gameWallsCount: newGameWallsCount});
      return;
    }
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  // This fires up when mouse enters a div
  // Here used for scrolling
  handleMouseEnter(row, col) {
    if(visualizing||!is_board_clear) return;
    if(is_Start)
    {
      document.getElementById(`node-${prevRowStart}-${prevColStart}`).className =
            prevClass;
      prevClass = document.getElementById(`node-${row}-${col}`).className;
      document.getElementById(`node-${row}-${col}`).className =
            'node node-start';
      prevRowStart=row;
      prevColStart=col;
      this.setState({START_NODE_ROW: row,START_NODE_COL:col});
      return;
    }
    if(is_Finish)
    {
      document.getElementById(`node-${prevRowFinish}-${prevColFinish}`).className =
            'node';
      document.getElementById(`node-${row}-${col}`).className =
            'node node-finish';
      prevRowFinish=row;
      prevColFinish=col;
      this.setState({FINISH_NODE_ROW: row,FINISH_NODE_COL:col});
      return;
    }
    if(
       !this.state.mouseIsPressed ||
       (row===this.state.START_NODE_ROW&&col===this.state.START_NODE_COL) ||
       (row===this.state.FINISH_NODE_ROW&&col===this.state.FINISH_NODE_COL )
      ) return;
    if(is_game_on)
    {
      const { grid } = this.state;
      const node = grid[row][col];
      if(node.isWall) return;
      var newGameWallsCount;
      if(grid[row][col].isGameWall)
        newGameWallsCount = this.state.gameWallsCount - 1;
      else
        newGameWallsCount = this.state.gameWallsCount + 1;
      const newGrid = getNewGridWithWallToggledGame(this.state.grid, row, col);      
      this.setState({grid: newGrid, mouseIsPressed: true, gameWallsCount: newGameWallsCount});
      return;
    }
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  // Handle Mouse Down works when finished click
  handleMouseUp() {
    if(visualizing||!is_board_clear) return;
    if(is_Start)
    {
      is_Start=false;
      return;
    }
    if(is_Finish)
    {
      is_Finish=false;
      return;
    }
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, this.state.speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        var flag = false;
        if(node.row===this.state.START_NODE_ROW&&node.col===this.state.START_NODE_COL)
        {
          flag=true;
        }
        else if(node.row===this.state.FINISH_NODE_ROW&&node.col===this.state.FINISH_NODE_COL)
        {
          flag=true;
        }
        if(!flag)
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
        }
      }, this.state.speed  * i);
    }
  }

  


  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        var flag = false;
        if(node.row===this.state.START_NODE_ROW&&node.col===this.state.START_NODE_COL)
        {
          flag=true;
        }
        else if(node.row===this.state.FINISH_NODE_ROW&&node.col===this.state.FINISH_NODE_COL)
        {
          flag=true;
        }
        if(!flag)
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
        }
      }, this.state.speed * 5 * i);
    }
    setTimeout(() => {
        document.getElementById("clearBoardBtn").disabled = false;
        document.getElementById("clearBoardBtn").className = "button";
        visualizing = false;
      }, this.state.speed * 5 * nodesInShortestPathOrder.length);
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
    const finishNode = grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    visualizing = true;
    document.getElementById("visualiseDataBtn").disabled = true;
    document.getElementById("visualiseDataBtn").className = "button-disabled";
    document.getElementById("gameBtn").disabled = true;
    document.getElementById("gameBtn").className = "button-disabled";
    document.getElementById("clearBoardBtn").disabled = true;
    document.getElementById("clearBoardBtn").className = "button-disabled";
    is_board_clear = false;
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  playGame() {
      document.getElementById("visualiseDataBtn").disabled = true;
      document.getElementById("visualiseDataBtn").className = "button-disabled";
      document.getElementById("clearBoardBtn").disabled = true;
      document.getElementById("clearBoardBtn").className = "button-disabled";
      document.getElementById("gameBtn").disabled = true;
      document.getElementById("gameBtn").className = "button-disabled";
      is_game_on = true;
      var time=0;
      document.getElementById(`node-${this.state.START_NODE_ROW}-${this.state.START_NODE_COL}`).className =
              'node';
      document.getElementById(`node-${this.state.FINISH_NODE_ROW}-${this.state.FINISH_NODE_COL}`).className =
              'node';
      this.setState({timer: 30,shortest_path:0,user_score:0,shortest_path_length:0, START_NODE_ROW:0,START_NODE_COL:0,FINISH_NODE_COL:56,FINISH_NODE_ROW:20});
      document.getElementById(`node-${0}-${0}`).className =
              'node node-start';
      document.getElementById(`node-${20}-${56}`).className =
              'node node-finish';
      for(var i=0;i<30;i++)
      {
        setTimeout(() => {
              var val = this.state.timer - 1;
              this.setState({timer: val});
            }, 1000*i);
      }
      time=1000*30;
      const {grid} = this.state;
      const nodesWithWall = getMaze(grid);

      for(var i=0;i<nodesWithWall.length;i++)
      {
        var row = nodesWithWall[i].row;
        var col = nodesWithWall[i].col;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
      }
      setTimeout(() => {
        const {grid} = this.state;
        const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
        const finishNode = grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
        const did_win = game(grid, startNode, finishNode);
        if(did_win)
        {
          var x = this.state.user_score + this.state.gameWallsCount;
          this.setState({user_score: x});
          alert('Your score is '+this.state.gameWallsCount);
        }
        else 
        {
          this.setState({user_score: 0});
          alert('Loss. Score is 0.');
        }
        is_game_on=false;
        document.getElementById("visualiseDataBtn").disabled = false;
        document.getElementById("clearBoardBtn").disabled = false;
        document.getElementById("visualiseDataBtn").className = "button";
        document.getElementById("clearBoardBtn").className = "button";
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        var shortest_path_length = nodesInShortestPathOrder.length-2;
        this.setState({shortest_path:shortest_path_length})
      }, time);     
  }

  resetGrid() {
    document.getElementById("visualiseDataBtn").disabled = true;
    // document.getElementById("clearBoardBtn").disabled = true;
    document.getElementById("visualiseDataBtn").className = "button-disabled";
    // document.getElementById("clearBoardBtn").className = "button-disabled";
    is_game_on=false;
    visualizing = true;
    const grid = getInitialGrid(this.state.START_NODE_ROW,this.state.START_NODE_COL,this.state.FINISH_NODE_ROW,this.state.FINISH_NODE_COL);
    for (let row = 0; row < 21; row++) {
      for (let column = 0; column < 57; column++) {
        setTimeout(() => {
          if(row===this.state.START_NODE_ROW&&column===this.state.START_NODE_COL)
          {
            document.getElementById(`node-${this.state.START_NODE_ROW}-${this.state.START_NODE_COL}`).className =
              'node node-start';
          }
          else if(row===this.state.FINISH_NODE_ROW&&column===this.state.FINISH_NODE_COL)
          {
            document.getElementById(`node-${this.state.FINISH_NODE_ROW}-${this.state.FINISH_NODE_COL}`).className =
              'node node-finish';
          }
          else
          {
            document.getElementById(`node-${row}-${column}`).className =
              'node';
          }
        }, this.state.speed * 5 * row);
      }
    }
    setTimeout(() => {
        document.getElementById("visualiseDataBtn").disabled = false;
        document.getElementById("visualiseDataBtn").className = "button";
        document.getElementById("clearBoardBtn").disabled = false;
        document.getElementById("clearBoardBtn").className = "button";
        document.getElementById("gameBtn").disabled = false;
        document.getElementById("gameBtn").className = "button";
        visualizing = false;
        is_board_clear = true;   
        this.setState({grid,gameWallsCount:0});
        }, this.state.speed * 5 * 21);
  }

  changeSpeed() {
    var x = document.getElementById("selectSpeed").value;
    this.setState({speed: x});
  }

  changeLevel() {
    var x = document.getElementById("selectLevel").value;
    this.setState({level: x});
  }

  render() {
    const {grid, mouseIsPressed} = this.state;
    const gameBtn = is_game_on ? 'Stop Game' : 'Start Game' ; 
    return (
      <div>
      <div className="navbar">
        <button onClick={() => this.visualizeDijkstra()} id="visualiseDataBtn" className="button">
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={() => this.playGame()} id="gameBtn" className="button">
          Start game
        </button>
        <button onClick={() => this.resetGrid()} id="clearBoardBtn" className="button">
          Clear Board
        </button>
        <p>Timer : {this.state.timer}</p>
        <p>Selected Path Length : {this.state.gameWallsCount}</p>       
        <p>Your Path Length : {this.state.user_score}</p>
        <p>Shortest Path : {this.state.shortest_path}</p>
        <br></br>
        {/* <select id="selectSpeed" onClick={() => this.changeSpeed()}>         
          <option value="5">Fast</option>
          <option value="40">Medium</option>
          <option value="80">Slow</option>          
        </select>
        <select  id="selectLevel" onClick={() => this.changeLevel()}>         
          <option value="80">Easy</option>
          <option value="65">Medium</option>
          <option value="50">Hard</option>          
        </select> */}
      </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="check">
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall, isGameWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isGameWall={isGameWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getInitialGrid = (startRow,startCol,finishRow,finishCol) => {
  const grid = [];
  for (let row = 0; row < 21; row++) {
    const currentRow = [];
    for (let col = 0; col < 57; col++) {
      currentRow.push(createNode(col, row,startRow,startCol,finishRow,finishCol));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col,row,startRow,startCol,finishRow,finishCol ) => {
  return {
    col,
    row,
    isStart: row === startRow && col === startCol,
    isFinish: row === finishRow && col === finishCol,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    isGameWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithWallToggledGame = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isGameWall: !node.isGameWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
