<div data-role="header" class="absolute">
    <a id="btnLogIn" href="#" data-icon="back" data-iconpos="notext">Log In</a>

    <h1>Sign Up</h1>
</div>

<div data-role="content" class="absolute">

    <div style="display: inline-block; width: 90px">
        <div id="btnAddPhoto">
            <img id="imgAvatar" src="images/avatar-light.png"/>
        </div>
    </div>

    <div style="position:absolute; display: inline-block; top: 5px; left: 105px; right: 15px">
        <input type="text" id="txtUsername" placeholder="Username (required)"/>
        <input type="password" id="txtPassword" placeholder="Password (required)"/>
    </div>

    <br/>

    <input type="text" id="txtDescription" placeholder="Geeky description (optional)"/>

    <div data-role="collapsible-set">
        <div data-role="collapsible" data-collapsed="false" data-iconpos="right" data-mini="true"
             data-content-theme="c">
            <h3>Basic</h3>

            <input type="text" id="txtFullName" data-mini="true" placeholder="Full Name (optional)"/>
            <input type="email" id="txtEmail" data-mini="true" placeholder="Email (optional)"/>
            <input type="text" id="txtCompany" data-mini="true" placeholder="Company (optional)"/>
            <input type="text" id="txtTel" data-mini="true" placeholder="Tel (optional)"/>
        </div>
        <div data-role="collapsible" data-iconpos="right" data-mini="true" data-content-theme="c">
            <h3>Social</h3>
            <input type="text" id="txtTwitter" data-mini="true" placeholder="Twitter handle e.g. @you (optional)"/>
            <input type="text" id="txtFacebook" data-mini="true" value="http://facebook.com/you"/>
            <input type="text" id="txtLinkedIn" data-mini="true" value="http://linkedin.com/in/you"/>
            <input type="url" id="txtWebsite" data-mini="true" placeholder="Website/Blog url (optional)"/>
        </div>
    </div>

    <button id="btnSignUp" data-theme="g">Sign Up</button>
</div>
