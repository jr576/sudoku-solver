import React, { Component } from 'react';
import './App.css';

class SudokuGrid extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            grid: Array(9).fill(0).map(() => Array(9).fill(0))
        };
        this.state = { ...this.initialState };
    }

    handleInputChange = (row, col, value) => {
        const parsedValue = value ? parseInt(value, 10) : 0;
        const newGrid = this.state.grid.map(row => [...row]);
        newGrid[row][col] = parsedValue;
        this.setState({ grid: newGrid });
    };

    solveSudoku = () => {
        const solvedGrid = solve(this.state.grid);
        if (solvedGrid)
            this.setState({ grid: solvedGrid });
    }

    resetGrid = () => {
        // Resets the grid to the initial state
        this.setState({ ...this.initialState });
    }

    render() {
        return (
            <div className="sudoku-grid">
                {this.state.grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="sudoku-row">
                        {row.map((cell, colIndex) => (
                            <input
                                key={`${rowIndex}-${colIndex}`}
                                className="sudoku-cell"
                                type="text"
                                maxLength="1"
                                value={cell === 0 ? '' : cell.toString()}
                                onChange={(e) => this.handleInputChange(rowIndex, colIndex, e.target.value)}
                            />
                        ))}
                    </div>
                ))}
                <button onClick={this.solveSudoku}>Solve Sudoku</button>
                <button onClick={this.resetGrid}>Reset</button>
            </div>
        );
    }
}



function solve(grid, row = 0, col = 0) {
    if (row === 9)
        return grid;
    if (col === 9)
        return solve(grid, row + 1, 0);
    if (grid[row][col] !== 0)
        return solve(grid, row, col + 1);

    for (let digit = 1; digit <= 9; digit++) {
        if (digitIsPossible(grid, row, col, digit)) {
            grid[row][col] = digit;
            let gridCopy = grid.map(row => row.slice());
            const result = solve(gridCopy, row, col + 1);
            if (result)
                return result;
            grid[row][col] = 0;
        }
    }

    return false;
}

function digitIsPossible(grid, row, col, digit) {
    for (let i = 0; i < 9; i++)
        if (grid[row][i] === digit || grid[i][col] === digit)
            return false;
    let rowStart = 3 * Math.floor(row / 3);
    let colStart = 3 * Math.floor(col / 3);
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (grid[rowStart + i][colStart + j] === digit)
                return false;
    return true;
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Sudoku Grid</h1>
                <SudokuGrid/>
            </div>
        );
    }
}
export default App;
