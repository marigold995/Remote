$(document).ready(function () {

    var token = null;
    var headers = {};
    var editingId;
    var skillsId = [];
    var actionType = "Create";
    var host = window.location.host;
    
    $("#divLogOut").css("display", "none");
       

    $("body").on("click", "#btnEdit", EditUser);
    $("body").on("click", "#btnDelete", DeleteUser);

    //load chosen picture 
    $("#profilePictureRegister").change(function () {
        readURL(this);
    });
    function readURL(input) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#profilePictureImg').attr('src', e.target.result);
            $('#profilePictureImg').css('display', 'block');
        };
        reader.readAsDataURL(input.files[0]);
    }

    //dynamic adding of rows for skills
    $("#btnAddRow").on("click", function (e) {
        $("#skillTable").append("<tr><td><input class=skill_name contenteditable=true type=text/></td><td><input class=skill_description contenteditable=true type=text /></td></tr>");
        $(".skill_name").addClass("skill");
        $(".skill_description").addClass("skill");
    });

    //registration of new user
    $("#btnRegister").click(function (/*e*/) {
        //e.preventDefault();
        var httpMethod;
        var url;
        var sendData;

        //get data from register form
        var name = $("#nameRegister").val();
        var lastname = $("#lastNameRegister").val();
        var birthday = $("#birthdayRegister").val();
        var email = $("#emailRegister").val();
        var password = $("#passwordRegister").val();
        var password2 = $("#password2Register").val();
        var profilepicture = $("#profilePictureImg").attr("src");
        var nameDescription = [];

        //Counter
        var i = 0;

        //function that takes skill names for user
        function getSkillName() {
            var list = [];
            for (i = 1; i < nameDescription.length; i++) {
                list[i - 1] = nameDescription[i].skill_name;
            }
            return list;
        }

        //function that takes skill description for user
        function getSkillDesc() {
            var list = [];
            for (i = 1; i < nameDescription.length; i++) {
                list[i - 1] = nameDescription[i].skill_desc;
            }
            return list;
        }
        
        $("#skillTable tbody tr").each(function (index, tr) {
            var tds = $(tr).find("td");
            // Check we've got two <td>s
            if (tds.length > 1) {
                // If we do, get their text content and add it to the data array
                nameDescription[i++] = {
                    skill_name: tds[0].childNodes[0].value,
                    skill_desc: tds[1].childNodes[0].value
                };
            }
        });

        //creating object from register form data in order to send it to database
        var registrationData = {
            "Name": name,
            "LastName": lastname,
            "Birthday": birthday,
            "Email": email,
            "Password": password,
            "ConfirmPassword": password2,
            "ProfileImage": profilepicture,
            "SkillName": getSkillName(),
            "SkillDescription": getSkillDesc()
        };

        var skillData = {
            "Name": getSkillName(),
            "Description": getSkillDesc()
        };

        //creating object from editing form in order to send it to database
        var editingData = {
            "Id": editingId,
            "Name": name,
            "LastName": lastname,
            "Birthday": birthday,
            "Email": email,
            "Password": password,
            "ConfirmPassword": password2,
            "ProfileImage": profilepicture,
            "UserName": email
        };

        if (actionType === "Create") {
            httpMethod = "POST";
            url = 'http://' + host + "/api/Account/Register";
            sendData = registrationData;
        }
        else {
            httpMethod = "PUT";
            url = 'http://' + host + "/api/Account/" + editingId.toString();
            sendData = editingData;
        }

        //send a data on endpoint
        CreateUser();
        function CreateUser() {
            // ajax call to endpoint
            $.ajax({
                url: url,
                type: httpMethod,
                data: sendData
            }).done(function (data) {       //do if it succeeded
                if (actionType === "Create") {
                    $("#regInfo").empty().append("Successful registration. You can login now!");                   
                                       
                    for (i = 0; i < skillData.Name.length; i++) {
                        var sendingData = {
                            "Name": skillData.Name[i],
                            "Description": skillData.Description[i]
                        };
                        CreateSkills(sendingData, i);
                    }
                    clearRegistrationForm(); 
                }
                else {
                    alert("Edits saved!");
                    clearRegistrationForm();
                    $("#divSkills").css("display", "block");
                    $("#emailRegister").attr('readonly', false);
                    $("#passwordRegister").attr("readonly", false);
                    $("#password2Register").attr('readonly', false);
                    $("#regInfo").empty();
                    $("#divHeader").empty().append("<h2>Create new user</h2>");
                    $("#btnRegister").val("Create");
                    GetUsersDatabase();
                }
                actionType = "Create";
            }).fail(function (data) {       //do if it failed
                alert("Unsuccessful registration!");
            });
        }

        //function that sends skills into database
        function CreateSkills(data1, i) {            
            $.ajax({
                url: 'http://' + host + "/api/skill/",
                type: "POST",
                data: data1, 
                async: false
            }).done(function (data) {       //do if it succeeded                
                CreateRelation(i);
            }).fail(function (data) {       //do if it failed
                alert("Unsuccessful skill writing!");
            });
        }

        //function that sends relation between user and skill into database
        function CreateRelation(i) {
            //for (i = 0; i < skillData.Name.length; i++) {            
            var relationsData = {
                "UserId": GetIdByEmail(registrationData.Email),
                "SkillId": GetIdByName(skillData.Name[i])
            };
            $.ajax({
                url: 'http://' + host + "/api/userskillrel/",
                type: "POST",
                data: relationsData,
                async: false
            }).done(function (data) {       //do if it succeeded               
            }).fail(function (data) {       //do if it failed
                alert("Unsuccessful relation writing!");
            });
           
        }

        //get skill id by name
        function GetIdByName(name) {
            if (token) {
                headers.Authorization = 'Bearer ' + token;
            }
            var sendData = { "name": name };
            var retvalue = null;
            $.ajax({
                url: 'http://' + host + "/api/skill",
                type: "get",
                data: sendData,
                async: false,
                headers: headers
            }).done(function (data1) {       //do if it succeeded
                retvalue = data1;
            }).fail(function (data1) {       //do if it failed                
                return false;
            });
            return retvalue;
        }

        //get user id by email
        function GetIdByEmail(email) {
            if (token) {
                headers.Authorization = 'Bearer ' + token;
            }
            var sendData = { "email": email };
            var retval = null;
            $.ajax({
                url: 'http://' + host + "/api/account/pretraga",
                type: "get",
                data: sendData,
                async: false,
                headers: headers
            }).done(function (data2) {       //do if it succeeded
                retval = data2;
            }).fail(function (data2) {       //do if it failed               
                return false;
            });
            return retval;
        }

    });

    //sign in for existing users
    $("#btnLogin").click(function () {
        var email = $("#emailLogin").val();
        var password = $("#passwordLogin").val();

        //creating object from sign in form data in order to check it indatabase
        var loginData = {
            "grant_type": "password",
            "username": email,
            "password": password
        };

        $.ajax({
            "type": "POST",
            "url": 'http://' + host + "/Token",
            "data": loginData
        }).done(function (data) {
            //show list of users
            token = data.access_token;
            $("#regInfo").empty();
            $("#divHeader").empty().append("<h2>Create new user</h2>");
            $("#btnRegister").val("Create");
            $("#btnLogin").css("display", "none");
            $("#divLogOut").css("display", "block");
            $("#divLogin").css("display", "none");
            $("#loginInfo").empty().append("Succesfull login! <br/> You are logged in as: <b>" + data.userName + "</b>");
            clearLoginForm();
            GetUsersDatabase();
        }).fail(function (data) {
            alert("Unsuccessful login!");
        });
    });

    //function that gets all registered users form database and puts it into table form
    function GetUsersDatabase() {
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        $.ajax({
            "type": "get",
            "url": 'http://' + host + "/api/account/users",
            headers: headers,
            async: false
        }).done(function (data) {
            $("#tableUsers").empty();
            for (i = 0; i < data.length; i++) {
                skillsId[skillsId.length] = GetSkillsIdByUserId(data[i].Id);
                for (j = 0; j < skillsId[i].length; j++) {
                    var skill = GetSkillById(skillsId[i][j]);
                    skillName = skill.Name;
                    skillDescription = skill.Description;
                    skillFinal = { "Name": skillName, "Description": skillDescription };

                    data[i].Skills[j] = skillFinal;

                }
            }
            var displayTable = "<h2>Registered users list</h2><br/><table class='table'>";
            var displayData = "";
            var displayHeader = "<tr id=\"tableHeader\"><th>Name</th><th>Last Name</th><th>Birthday</th><th>Profile image</th><th>Skill names</th></tr >";


            for (i = 0; i < data.length; i++) {
                var birthday = new Date(data[i].Birthday);
                var d = ("0" + birthday.getDate()).slice(-2);
                var m = ("0" + (birthday.getMonth() + 1)).slice(-2);
                var y = birthday.getFullYear();
                var fullDate = d + "-" + m + "-" + y;
                displayData = displayData + "<tr><td>" + data[i].Name + "</td><td>" + data[i].LastName + "</td><td>" + fullDate + "</td><td><img id=profilePictureImgTable src=\"" + data[i].ProfileImage + "\"/></td>";


                var stringId = data[i].Id.toString();
                var displayEditButton = "<td><button id=btnEdit class=btn-default name=" + stringId + ">Edit</button></td>";
                var displayDeleteButton = "<td><button id=btnDelete class=btn-default name=" + stringId + ">Delete</button></td>";
                var displaySkills = '\n';
                for (j = 0; j < data[i].Skills.length; j++) {

                    displaySkills = displaySkills + data[i].Skills[j].Name + "</br>";
                    //displaySkills = "</td><td>" + data[i].SkillName;                    
                }
                displayData = displayData + "<td>" + displaySkills + "</td>" + displayEditButton + displayDeleteButton + "</tr>";
            }
            displayTable = displayTable + displayHeader + displayData + "</table>";
            if (token !== null) {
                $("#tableUsers").css("display", "block");                
                $("#tableUsers").append(displayTable);
            }
        }).fail(function (data) {
            alert("Ne valja pristup korisnicima!");
        });
    }

    //get ids of skills of some with specified id
    function GetSkillsIdByUserId(userId) {  
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var retVal = [];
        $.ajax({
            url: 'http://' + host + "/api/userskillrel/" + userId.toString(),
            type: "get",
            async: false,
            headers: headers
        }).done(function (data) {
            console.log(data);
            for (k = 0; k < data.length; k++) {
                retVal[retVal.length] = data[k].SkillId;
            }
        }).fail(function () {          
            return false;
        });
        return retVal;
    }

    function GetSkillById(skillId) {
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var retVal = null;
        $.ajax({
            url: 'http://' + host + "/api/skill/" + skillId.toString(),
            type: "get",
            async: false,
            headers: headers
        }).done(function (data) {
            console.log(data);
            retVal = data;
        }).fail(function () {           
            return false;
        });
        return retVal;
    }   

    function EditUser() {
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        //get an id of user that we want to edit
        var editId = this.name;
        $.ajax({
            url: 'http://' + host + "/api/account/" + editId.toString(),
            type: "GET",
            headers: headers
        }).done(function (data) {
            $("#nameRegister").val(data.Name);
            $("#lastNameRegister").val(data.LastName);

            //preparation of datetime to date format ----> slice method adds zero if date or month has 1 digit only
            var birthday = new Date(data.Birthday);
            var d = ("0" + birthday.getDate()).slice(-2);
            var m = ("0" + (birthday.getMonth() + 1)).slice(-2);
            var y = birthday.getFullYear();
            var fullDate = y + "-" + m + "-" + d;
            $("#birthdayRegister").val(fullDate);
            $("#profilePictureImg").attr("src", data.ProfileImage);

            $("#emailRegister").val(data.Email);
            $("#passwordRegister").val(data.Password);
            $("#password2Register").val(data.ConfirmPassword);

            $("#emailRegister").attr('readonly', true);
            $("#passwordRegister").attr("readonly", true);
            $("#password2Register").attr('readonly', true);

            $("#divSkills").css("display", "none");

            $("#divHeader").empty().append("<h2>Edit user</h2>");
            $("#btnRegister").val("Save edits");

            editingId = data.Id;
            actionType = "Update";
            GetUsersDatabase();

        }).fail(function () {
            alert("Error while loading a user!");
        });

    }

    function DeleteUser() {
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var deleteId = this.name;

        var selectedRelations = GetRelationByUserId(deleteId);
        for (i = 0; i < selectedRelations.length; i++) {
            DeleteRelation(selectedRelations[i]);
        }

        $.ajax({
            url: 'http://' + host + "/api/account/" + deleteId.toString(),
            type: "DELETE",
            headers: headers
        }).done(function (data) {
            GetUsersDatabase();
        }).fail(function () {
            alert("Deleting user failed!");
        });
    }

    function GetRelationByUserId(id) {
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var retVal = null;
        $.ajax({
            url: 'http://' + host + "/api/userskillrel/" + id.toString(),
            type: "get",
            async: false,
            headers: headers
        }).done(function (data) {
            retVal = data;
        }).fail(function () {
            alert("Unsuccessful relation getting!");
            return false;
        });
        return retVal;
    }

    function DeleteRelation(selectedRelation) {
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        $.ajax({
            url: 'http://' + host + "/api/userskillrel/" + selectedRelation.Id.toString(),
            type: "DELETE",
            async: false,
            headers: headers
        }).done(function (data) {
            alert("Deleting relation succeded!");
        }).fail(function () {
            alert("Deleting user failed!");
        });
    }

    // clears input fields after registration
    function clearRegistrationForm() {
        $("#nameRegister").val('');
        $("#lastNameRegister").val('');
        $("#birthdayRegister").val('');
        $("#emailRegister").val('');
        $("#passwordRegister").val('');
        $("#password2Register").val('');
        $("#profilePictureImg").val('');
        $('#profilePictureImg').css('display', 'none');
        $("input[class=skill_name]").val('');
        $("input[class=skill_description]").val('');
    }

    // clears input fields after login
    function clearLoginForm() {
        $("#emailLogin").val('');
        $("#passwordLogin").val('');
    }

    $("#btnLogOut").click(function () {
        LogOut();
    });

    function LogOut() {
        token = null;
        headers = {};
        $("#divLogin").css("display", "block");
        $("#btnLogin").css("display", "block");
        $("#loginInfo").empty();
        $("#divLogOut").css("display", "none");       
        $("#tableUsers").empty();
        $("#tableUsers").css("display", "none");
        $("#divHeader").empty().append("<h2>Register form</h2>");
        $("#btnRegister").val("Register");
    }
});