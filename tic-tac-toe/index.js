
let val=0;
let game="running";
let winner="none";

const arr= [
    ["","",""],
    ["","",""],
    ["","",""]
];

const tiles = document.querySelectorAll(".tiles");
const result = document.getElementById("result");
const xButton = document.getElementById("xButton");
const oButton = document.getElementById("oButton");

    tiles.forEach(tiles => {
        tiles.addEventListener("click",handleTileClick); 
    });
            function handleTileClick(event) {

            const row = event.target.getAttribute("data-row");
            const column = event.target.getAttribute("data-column");

            console.log(`Button clicked at Row: ${row}, Column: ${column}`);
            if (arr[row][column] !== "") {
                result.textContent="Tile already filled!";
            }
            else{
                arr[row][column]=val;
                checkWin();
                
                if (val===0){
                    val=1;
                    event.target.textContent = "X";
                    result.textContent="Player O's turn";
                    xButton.style.color="grey";
                    oButton.style.color=" #d5c0de";
                    xButton.style.background=" rgba(48, 52, 52, 0.26)";
                    oButton.style.background=" rgba(129, 134, 134, 0.26)";


                }
                else if(val===1){
                    val=0;
                    event.target.textContent = "O";
                    result.textContent="Player X's turn";
                    oButton.style.color="grey";
                    xButton.style.color=" #d5c0de";
                    
                    oButton.style.background=" rgba(48, 52, 52, 0.26)";
                    xButton.style.background=" rgba(129, 134, 134, 0.26)";

                }
                
                if (checkWin()) {
                    winner = val === 0 ? "O" : "X";
                    game = "end";
                    result.textContent=`Game Over! Winner: ${winner}`;

                    disableListeners();
                } else if (checkDraw()) {
                    game = "end";
                    result.textContent="Game Over! It's a draw!";
                    disableListeners();
                }            }

            };

    function checkWin(){
        return(
            //horizontal
           (arr[0][0]===arr[0][1] && arr[0][0]===arr[0][2] && arr[0][0] !== "") ||
           (arr[1][0]===arr[1][1] && arr[1][0]===arr[1][2] && arr[1][0] !== "") ||
           (arr[2][0]===arr[2][1] && arr[2][0]===arr[2][2] && arr[2][0] !=="") ||
    
           // columns
           (arr[0][0]===arr[1][0] && arr[0][0]===arr[2][0] && arr[0][0] !=="") ||
           (arr[0][1]===arr[1][1] && arr[0][1]===arr[2][1] && arr[0][1] !=="") ||
           (arr[0][2]===arr[1][2] && arr[0][2]===arr[2][2] && arr[0][2] !== "") ||
    
           //diagonals
           (arr[0][0]===arr[1][1] && arr[0][0]===arr[2][2] && arr[0][0] !=="") ||
           (arr[0][2]===arr[1][1] && arr[0][2]===arr[2][0] && arr[0][2] !=="")
        );
           
    }
    function checkDraw() {
        return arr.flat().every(cell => cell !== "");
    }
    
    function disableListeners() {
        tiles.forEach(tile => {
            tile.removeEventListener("click", handleTileClick);
        });
    }