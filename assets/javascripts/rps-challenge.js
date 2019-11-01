
    var firebaseConfig = {
        apiKey: "AIzaSyD20JnZ5ePU3_xWyOzuYNFYZUAGsT03-0s",
        authDomain: "rps-challange.firebaseapp.com",
        databaseURL: "https://rps-challange.firebaseio.com",
        projectId: "rps-challange",
        storageBucket: "rps-challange.appspot.com",
        messagingSenderId: "575495147726",
        appId: "1:575495147726:web:6c521e298160837498809f",
        measurementId: "G-679SV61VJD"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    var database = firebase.database();

    var conRef = database.ref("/connections");

    var con = database.ref(".info/connected");

    var player1 ="";
    var player2  ="";
    var choice1 = "";
    var choice2="";
    var chatPlayerName = "";
    var user1Wins=0;
    var user2Win=0;
    var user1Losses=0;
    var user2Losses=0;
    var ifOccupiedPlayer1=false;
    var ifOccupiedPlayer2=false;
    var numOfCon;
    var messages="";
    var counter=0;
    var userOneKey="";
    var userTwoKey="";

    con.on("value", function(snap) {
        if (snap.val()) {
            var con = conRef.push(true);
            con.onDisconnect().remove();
        }
    });
    conRef.on("value",function(snap){

        numOfCon = snap.numChildren();
        
    });
    
$(document).ready(function(){

    /*
    -----------------------------------------------
    username with initial information

    -------------------------------------------------
    */
    $(".btn-choice").on("click",function(e){
        e.preventDefault();
        player = $("#userName").val().trim();
        chatPlayerName=player;
       
        if(numOfCon%2==1){

            updatingUser1Info();
           
        }
        else if(numOfCon%2==0){
            updatingUser2Info();
            
        }
        
        else if(numOfCon>2){
            
            $("#heading").html("<h2 class= 'text-center'> Hi "+player+"!! you are player 2<p> wait for player 1 selection!</p>");
            
        }
        
    });
    /*
    -----------------------------------------------
    when player2 make a choice out of three option
    and click and call the eventListener
    -------------------------------------------------
    */
    $('#choices_one').on("click",'a',function(e){
        choice1 = $(this).text();
        var user1 = $("#player_one").text();
        var user2 =$("#player_two").text();
       
        var postData={
            user:user1,
            choice:choice1,
            flag:ifOccupiedPlayer1
        }
        var updates = {};
        updates['/user/'+user1]=postData;
        database.ref().update(updates);
        
        if(choice1!=="" && choice2!=="")
        {
            var user2 = $("#player_two").text();
            gettingResult(choice1,choice2,user1,user2);
        }
    });

    /*
    -----------------------------------------------
    when player2 choose out of three option

    -------------------------------------------------
    */
    $('#choices_two').on("click",'a',function(e){
        choice2 = $(this).text();
       
        
        var user2 = $("#player_two").text();
        var user1 = $("#player_one").text()
        

        var postData={
            user:user2,
            choice:choice2,
            flag:ifOccupiedPlayer2
        }
        var updates = {};
        updates['/user/'+user2]=postData;
        database.ref().update(updates);

        if(choice1!=="" && choice2!=="")
        {
            console.log("for result1")
            var user1 = $("#player_one").text()
            gettingResult(choice1,choice2,user1,user2);
        }
    });
/*
------------------------------------------
updating the chatbot and adding data in dB
-----------------------------------------
*/

    $("#chat").on("click",function(e){
        e.preventDefault();

        var message = $("#chatText").val();
        database.ref("/chat").push({
            name:chatPlayerName,
            message:message
        })
        $("#chatText").val("");

    })
/*
------------------------------------------
getting the chatbot data and display
-----------------------------------------
*/

database.ref("/chat").on("child_added",function(snapshot){
    
    if(snapshot.val()){
       
       $("#member-chat").append(snapshot.val().name+" : "+snapshot.val().message+"\n");
        
    }

},
function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
/*
-------------------------------------------------------
updating the users properties such as name, wins/losses 
choice from DB
---------------------------------------------------------
*/

database.ref("/user").on("value",function(snap){
    
    if(snap.val()){
        
        if(Object.keys(snap.val()).length==2){
            
            var keys = Object.keys(snap.val());
            
            var obj1 = snap.val()[keys[0]];
            var obj2 = snap.val()[keys[1]];
            
            player1 =keys[1];
            player2=keys[0];

            ifOccupiedPlayer1=obj1.flag;
            ifOccupiedPlayer2=obj2.flag;
            

            $("#player_two").text(player2);
            $("#player_one").text(player1);
            if(Object.keys(obj1).length===3)
               choice2=obj1.choice
           
            if(Object.keys(obj2).length === 3)
                choice1=obj2.choice
                
           
            else if (Object.keys(obj1).length === 5)
            {
                user2Win=obj1.win;
                $("#win2").append(" "+user2Win);
                user2Losses=obj1.loss;
                $("#loss2").append(" "+user2Losses);

            }
            if (Object.keys(obj2).length===5){
                user1Wins=obj2.win;
                $("#win1").append(" "+user1Wins);
                user1Losses=obj2.loss;
                $("#loss1").append(" "+user1Losses);

            }
            
        }  
            
    }
},
function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

/*
---------------------------------------------------
updating the wins/losses as per the defined rules
---------------------------------------------------
*/


function gettingResult(choice1,choice2,player1,player2)
{
    if(choice1 === choice2)
    {
        $("#result").html("<h2>it's a tie with choice "+choice1+" over "+choice2+"</h2>");
    }
    else if (
        (choice1 === 'Rock' &&
            choice2 !== 'paper') ||
        (choice1 === 'paper' &&
            choice2 !== 'scissor') ||
        (choice1 === 'scissor' &&
        choice2 !== 'Rock')
    )
    {
        $("#result").html("<h2>" + player1+" is winner with choice "+choice1+" over "+choice2+"</h2>");
        (user1Wins)++;
        (user2Losses)++;

    }
    
    else{
       
        $("#result").html("<h2>" + player2+" is winner with choice "+choice2+" over "+choice1+" </h2>");
        (user2Win)++;
        (user1Losses)++;
    }
    console.log(user2Win,user1Wins,user1Losses,user2Losses);
    updatingDB(player2, player1);
    
 
}

});
/*-----------------------------------------------
    Player1 iniytial info updating in DB
 -------------------------------------------------
    */
function updatingUser2Info() {
    $("#player_two").text(player);
    $("#heading").html("<h2 class= 'text-center'> Hi " + player + "!! you are player 2<p> wait for player 1 selection!</p>");
    player2 = player;
    ifOccupiedPlayer2 = true;
    $("#choices_two").append("<li><a href='#' class='a_cls'>Rock</li>");
    $("#choices_two").append("<li><a href='#' class='a_cls'>Paper</li>");
    $("#choices_two").append("<li><a href='#' class='a_cls'>Scissor</li>");
    database.ref("/user/" + player).set({
        user: player,
        flag: ifOccupiedPlayer2,
    });
    userTwoKey = player;
}
/*-----------------------------------------------
   Player2 iniytial info updating in DB
-------------------------------------------------
    */

function updatingUser1Info() {
    
    $("#player_one").text(player);
    $("#heading").html("<h2 class= 'ml-5'> Hi " + player + "!! you are player 1 waiting for player2!");
    player1 = player;
    ifOccupiedPlayer1 = true;
    $("#choices_one").append("<li><a href='#' class='a_cls'>Rock</li>");
    $("#choices_one").append("<li><a href='#' class='a_cls'>Paper</li>");
    $("#choices_one").append("<li><a href='#' class='a_cls'>Scissor</li>");
    database.ref("/user/" + player).set({
        user: player,
        flag: ifOccupiedPlayer1,
    });
    if (!$("#player_two").text() && player2 != "") {
        $("#player_two").text(player2);
    }
}

/*-----------------------------------------------------


---------------------------------------------------*/

function updatingDB(player2, player1) {
    ifOccupiedPlayer1 = false;
    ifOccupiedPlayer2 = false;
    choice1 = "";
    choice2 = "";
    var postData = {
        user: player2,
        choice: choice2,
        flag: ifOccupiedPlayer2,
        win: user2Win,
        loss: user2Losses
    };
    var updates = {};
    updates['/user/' + player2] = postData;
    database.ref().update(updates);
    var postData = {
        user: player1,
        choice: choice1,
        flag: ifOccupiedPlayer1,
        win: user1Wins,
        loss: user1Losses
    };
    var updates = {};
    updates['/user/' + player1] = postData;
    database.ref().update(updates);
    
}

