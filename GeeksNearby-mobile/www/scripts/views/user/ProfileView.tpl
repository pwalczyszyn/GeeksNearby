<div data-role="header" class="absolute" data-id="headerBar" data-position="fixed">
    <a id="btnBack" href="#" data-icon="back" data-iconpos="notext">Back</a>

    <h1>Geeky Info</h1>

    <a id="btnLogOut" href="#" data-icon="forward">Log Out</a>
</div>

<div data-role="content" class="absolute">

    <div style="display: inline-block; width: 90px">
        <div id="btnAddPhoto">
            <img id="imgAvatar" src="<% if (user.has('avatar')) { %><%= user.get('avatar').url %> <% } else { %>images/avatar-light.png<% } %>"/>
        </div>
    </div>

    <div style="position:absolute; display: inline-block; top: 5px; left: 105px; right: 15px">
        <div data-role="controlgroup">
            <input type="text" id="txtUsername" placeholder="Username (required)" disabled="true"
                   value="<%= user.escape('username') %>"/>
            <input type="password" id="txtPassword" name="password" placeholder="New password"/>
        </div>
    </div>

    <input type="text" id="txtDescription" name="description" value="<%= user.escape('description') %>"
           placeholder="Geeky description (optional)"/>

    <div data-role="collapsible-set">
        <div data-role="collapsible" data-collapsed="false" data-iconpos="right" data-mini="true"
             data-content-theme="c">
            <h3>Basic</h3>

            <input type="text" id="txtFullName" name="fullName" data-mini="true" value="<%= user.escape('fullName') %>"
                   placeholder="Full Name (optional)"/>
            <input type="email" id="txtEmail" name="emailAddress" data-mini="true"
                   value="<%= user.escape('emailAddress') %>"
                   placeholder="Email (optional)"/>
            <input type="text" id="txtCompany" name="company" data-mini="true" value="<%= user.escape('company') %>"
                   placeholder="Company (optional)"/>
            <input type="text" id="txtTel" name="tel" data-mini="true" value="<%= user.escape('tel') %>"
                   placeholder="Tel (optional)"/>
        </div>
        <div data-role="collapsible" data-iconpos="right" data-mini="true" data-content-theme="c">
            <h3>Social</h3>

            <input type="text" id="txtTwitter" name="twitter" data-mini="true" value="<%= user.escape('twitter') %>"
                   placeholder="Twitter handle e.g. @you (optional)"/>
            <input type="url" id="txtFacebook" name="facebook" data-mini="true" value="<%= user.escape('facebook') %>"
                   placeholder="http://facebook.com/you"/>
            <input type="url" id="txtLinkedIn" name="linkedIn" data-mini="true" value="<%= user.escape('linkedIn') %>"
                   placeholder="http://linkedin.com/in/you"/>
            <input type="url" id="txtWebsite" name="website" data-mini="true" value="<%= user.escape('website') %>"
                   placeholder="Website/Blog url (optional)"/>
        </div>
    </div>

    <br/>

    <button id="btnDeleteAccount" data-theme="r">Delete Geek Account</button>

</div>

