// Userlist data array for filling in info box
var userListData = [];

// DOM READY
$(document).ready(function() {
  // Populate the user table on initial page load
  populateTable();
  // Username link click
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

  // Add User button click
  $('#btnAddUser').on('click', addUser);

  // Delete User link on click
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

// FUNCTIONS
// To fill HTML table with data
function populateTable() {

  // Empty content string
  var tableContent = '';
  // jQuery AJAX call for JSON
  $.getJSON( '/users/userlist', function( data ) {
    // Stick our user data array into a userlist variable in the global object
    userListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#userList table tbody').html(tableContent);
  });
};

// To Show User Info
function showUserInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();
    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');
  
    // Get Index of object based on id value
    //.map to apply a function to each object in our userListData array
    var arrayPosition = userListData.map(function(arrayItem) { 
        return arrayItem.username; 
    }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};

// To Add User
function addUser(event) {
  event.preventDefault();
  // Validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {
    // If it is, compile all user info into one object
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser', // http://localhost:3000/users/adduser
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {
        // Clear the form inputs
        $('#addUser fieldset input').val('');
        // Update the table
        populateTable();
      }
      else {
        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);
      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

// To Delete User upon Delete click 
function deleteUser(event) {
  event.preventDefault();
  // Pop up a confirmation dialog on clicking DELETE
  var confirmation = confirm('Are you sure you want to delete this user?');

  // Check and make sure the user is confirmed for deletion
  if (confirmation === true) {
    // If yes, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
        console.log("User successfully deleted.");
      }
      else {
        // if the user didnt get deleted
        alert('Error: ' + response.msg);
      }
      // Update the HTML table
      populateTable();
    });
  }
  else {
    // If CANCEL to the confirm, do nothing
    return false;
  }

};