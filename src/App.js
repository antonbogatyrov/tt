import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

const values = {
  x: "X",
  zero: "0",
  empty: null,
};

const initialBoardState = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const checkWin = (x, y, value, board) => {
  const isVerticalWin = Array.from({ length: 3 })
    .map((v, k) => board[k][y])
    .every((val) => val === value);

  const isHorizontalWin = board[x].every((val) => val === value);
  const isDiagonalLeftWin = [board[0][0], board[1][1], board[2][2]].every(
    (val) => val === value
  );
  const isDiagonalRightWin = [board[0][2], board[1][1], board[2][0]].every(
    (val) => val === value
  );

  return (
    isVerticalWin || isHorizontalWin || isDiagonalLeftWin || isDiagonalRightWin
  );
};

function App() {
  const [winner, setWinner] = useState();
  const [draw, setDraw] = useState(false);
  const next = useRef(values.zero);

  const [board, setBoard] = useState(initialBoardState);

  useEffect(() => {
    const isEmptyPresent = board.reduce((acc, current) => {
      const isSomeEmpty = current.some((val) => !val);
      return acc || isSomeEmpty;
    }, false);
    setDraw(!isEmptyPresent && !winner);
  }, [board, winner]);

  const reloadGame = useCallback(() => {
    next.current = values.zero;
    setWinner(false);
    setDraw(false);
    setBoard(initialBoardState);
  }, []);

  const toggleField = (x, y) => {
    const target = board[x][y];
    if (target || winner || draw) {
      return;
    }

    next.current = next.current === values.x ? values.zero : values.x;

    const newBoard = board.map((line, lineKey) => {
      if (lineKey === x) {
        return line.map((vertical, verticalKey) => {
          if (verticalKey === y) {
            return next.current;
          }
          return vertical;
        });
      }
      return line;
    });

    setBoard(newBoard);
    const isWin = checkWin(x, y, next.current, newBoard);
    if (isWin) {
      setWinner(next.current);
    }
  };

  return (
    <div className="App">
      <div className="header">
        {draw && <span>Draw</span>}
        {winner && <span>winner: {winner}</span>}
        <button onClick={reloadGame}>Reload</button>
      </div>
      {board.map((line, lineKey) => (
        <div className="line" key={lineKey}>
          {line.map((cell, cellKey) => (
            <div
              onClick={() => toggleField(lineKey, cellKey)}
              className="cell"
              key={cellKey}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
