<div data-role="header" class="absolute" data-id="headerBar" data-position="fixed">
    <a id="btnBack" href="#" data-icon="back" data-iconpos="notext"></a>

    <h1>Geeky Info</h1>

    <a id="btnLogOut" href="#" data-icon="forward">Log Out</a>
</div>

<div data-role="content" class="absolute">

    <div style="display: inline-block; width: 90px">
        <div id="btnAddPhoto">
            <img src="<% if (avatar) { %><%= avatar.url %> <% } else { %>images/avatar-light.png<% } %>"/>
        </div>
    </div>

    <div style="position:absolute; display: inline-block; top: 5px; left: 105px; right: 15px">
        <div data-role="controlgroup">
            <input type="text" id="txtUsername" placeholder="Username (required)" disabled="true" value="<%= username %>"/>
            <input type="password" id="txtPassword" placeholder="New password"/>
        </div>
    </div>

    <br/>

    <input type="text" id="txtFullName" placeholder="Full Name (optional)" value="<%= fullName %>"/>
    <input type="text" id="txtEmail" placeholder="Email (optional)" value="<%= email1 %>"/>
    <input type="text" id="txtCompany" placeholder="Company (optional)" value="<%= company %>"/>
    <input type="text" id="txtTel" placeholder="Tel (optional)" value="<%= tel %>"/>

    <br/>

    <button id="btnDeleteAccount" data-theme="r">Delete Geek Account</button>

</div>

