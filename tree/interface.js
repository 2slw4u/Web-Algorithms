start_button.addEventListener('click', start);
reset_button.addEventListener('click', reset);
getFile1_button.addEventListener('click', chooseIndex0);
getFile2_button.addEventListener('click', chooseIndex1);
getFile3_button.addEventListener('click', chooseIndex2);
getFile_button.addEventListener('click', createTree);
optimize_button.addEventListener('click', optimize);
const FILE = document.getElementById('file_input');
let flag = true;
let root;

document.getElementById('input_data').value = "Солнечно, Жарко, Высокая, Слабый, Прохладно, 2";
let index = 0;

function chooseIndex0() {
    document.getElementById('input_data').value = "Пасмурно, Прохладно, Нормальная, Слабый, Прохладно, 46";
    index = 0;
    createTree();
}

function chooseIndex1() {
    document.getElementById('input_data').value = "Ниже,     Дома,    Пропускают, Да";
    index = 1;
    createTree();
}

function chooseIndex2() {
    document.getElementById('input_data').value = "";
    index = 2;
    createTree();
}

startTreeBuilding(getData(index));

let treeRoot = document.getElementById("root");//ul html

function createTree() {
    treeRoot = removeTree();
    if(FILE.value === '') {
        startTreeBuilding(getData(index));
        drawTree(root, treeRoot);
    }
    else {
        console.log("!")
        let data = FILE.files[0];
        let reader = new FileReader();
        reader.readAsText(data);
        reader.onload = function () {
            console.log(data);
            data = recieveData(reader.result);
            startTreeBuilding(data);
            drawTree(root, treeRoot);
        }
    }
    flag = true;
} 

function start() {
    if(flag) {
        makeDecision();
        flag = false;
    }
}

function reset() {
    treeRoot = removeTree(treeRoot);
}



function drawTree(currentNode, treeElement) {
    //console.log(currentNode, treeElement);
    let li = document.createElement("li");
    let a = document.createElement("a");
    //console.log(a);
    currentNode.a = a;
    a.href = "#";
    let nodeName = currentNode.name;
    //console.log('draw' + currentNode)
    if(nodeName === "root") {
        a.textContent = nodeName;
    }
    else {
        let feature = currentNode.parent.decisionMaker;
        a.textContent = feature + " : " + nodeName;
    }
    
    li.appendChild(a);
    treeElement.appendChild(li);
    if(currentNode.isleaf){
        let finalUl = document.createElement("ul");
        let finalLi = document.createElement("li");
        let finalA = document.createElement("a");
        finalA.href = "#";
        finalA.textContent = currentNode.value
        finalLi.appendChild(finalA);
        finalUl.appendChild(finalLi);
        li.appendChild(finalUl);

        return;
    }
    let ul = document.createElement("ul");
    li.appendChild(ul);
    for (let i = 0; i < currentNode.children.length; i++) {
        drawTree(currentNode.children[i], ul);
    }
}

function optimize() {
    if(flag) {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        if (FILE.value === '') {
            root = new TreeNode(getData(index), 'root');
        } else {
            let data = FILE.files[0];
            let reader = new FileReader();
            reader.readAsText(data);
            reader.onload = function () {
                data = recieveData(reader.result);
                root = new TreeNode(data, 'root');
            }
        }
        buildTree(root);
        optimizeTree(root);
        document.getElementById("root").innerHTML = "";
        drawTree(root, treeRoot);
    }
}

function removeTree() {
    let divTree = document.getElementById("tree");
    treeRoot.remove();
    let ul = document.createElement("ul");
    ul.setAttribute('id', 'root')
    divTree.appendChild(ul);
    return ul;
}

drawTree(root, treeRoot);