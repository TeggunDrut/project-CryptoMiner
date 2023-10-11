var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
let width = (canvas.width = window.innerWidth * 0.6);
const height = (canvas.height = 400);

var boxSize = 50;

var rows = height / boxSize;
var columns = width / boxSize - 2;

let originalMaxHeight = 400;
let maxHeight = 400;

var values = [];

let savedPlayers = [
    {
        name: "Player 1",
        cash: 100,
    },
    {
        name: "Player 2",
        cash: 200,
    },
    {
        name: "Player 3",
        cash: 300,
    },
    {
        name: "Player 4",
        cash: 1231231,
    },
    {
        name: "Player 5",
        cash: 500,
    }
];

let leaderboardTable = document.getElementById("leaderboard");

function addToLeaderboard(leaderboard, rank, name, cash) {
    var row = leaderboard.insertRow();
    var rankCell = row.insertCell();
    var nameCell = row.insertCell();
    var cashCell = row.insertCell();
    rankCell.textContent = rank;
    nameCell.textContent = name;
    cashCell.textContent = cash;
}

savedPlayers.sort((a, b) => b.cash - a.cash);

for(const player of savedPlayers) {
    addToLeaderboard(leaderboardTable, savedPlayers.indexOf(player) + 1, player.name, player.cash);
}


function updateValues(newValue) {
    if (values.length >= columns) {
        // Only remove the oldest value if the array is full
        values.pop(); // Remove the oldest value from the end of the array
    }
    values.unshift(newValue); // Add the new value at the beginning of the array
}

function drawValues() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the grid
    ctx.lineWidth = 0.25;
    ctx.strokeStyle = "lightgray";
    for (var x = 0; x < columns; x++) {
        for (var y = 0; y < rows; y++) {
            ctx.strokeRect(x * boxSize, y * boxSize, boxSize, boxSize);
        }
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";

    var min = Math.min(...values);
    var range = Math.max(...values) - min;
    ctx.beginPath();
    for (var i = 0; i < values.length; i++) {
        var x = (columns - i - 1) * boxSize; // Adjust the x coordinate
        var y = canvas.height - ((values[i] - min) / range) * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2, true); // Draw a small circle
        ctx.fillStyle = "blue"; // Set the color for filling
        ctx.fill();
        if (i > 0) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
                (columns - i) * boxSize,
                canvas.height - ((values[i - 1] - min) / range) * canvas.height
            );
            ctx.stroke();
        }
    }
}

function drawLabels(min, max, numLabels) {
    var step = (max - min) / numLabels;
    var labelOffset = 10; // Adjust as needed
    ctx.font = "20px Arial"; // Adjust the size and font as needed
    ctx.fillStyle = "black";
    ctx.textAlign = "right"; // Align the text on the right
    ctx.textBaseline = "middle"; // Center the text vertically
    for (var i = 0; i <= numLabels; i++) {
        var y = canvas.height - (i + 0.5) * (canvas.height / numLabels); // Adjust the y coordinate
        var value = min + i * step;
        ctx.fillText(value.toFixed(2), canvas.width - labelOffset, y);
    }
}

var blockchain = new Blockchain();
let num = 2;

function update() {
    let maxHeight = Math.max(...values);

    var newValue = 0;
    if (blockchain.chain.length > 1) {
        newValue = blockchain.chain[blockchain.chain.length - 1].data;
    } else {
        newValue = 0;
    }
    newValue += Math.random() * num - num / 2; //

    if (newValue < 0) {
        newValue = 0;
    }

    // Generate a new random value between 0 and canvas.height

    blockchain.addBlock(new Block(Date.now(), newValue));
    updateValues(newValue);
    drawValues();
    drawLabels(0, maxHeight, rows * 2); // Adjust min and max as needed

}
update();
setInterval(update, 1000);

window.addEventListener("resize", function () {
    width = canvas.width = window.innerWidth * 0.7;
    columns = width / boxSize - 2;
});
