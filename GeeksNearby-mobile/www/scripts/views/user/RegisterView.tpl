<div data-role="header" class="absolute">
    <a id="btnLogIn" href="#" data-icon="back">Log In</a>

    <h1>Register</h1>
</div>

<div data-role="content" class="absolute">

    <div style="display: inline-block; width: 90px">
        <div id="btnAddPhoto">
            <img src="images/avatar-light.png"/>
        </div>
    </div>

    <div style="position:absolute; display: inline-block; top: 5px; left: 105px; right: 15px">
        <input type="text" id="txtUsername" placeholder="Username (required)"/>
        <input type="password" id="txtPassword" placeholder="Password (required)"/>
    </div>

    <br/>

    <div data-role="collapsible-set">
        <div data-role="collapsible" data-collapsed="false" data-iconpos="right" data-mini="true"
             data-content-theme="c">
            <h3>Basic</h3>

            <input type="text" id="txtFullName" placeholder="Full Name (optional)"/>
            <input type="text" id="txtEmail" placeholder="Email (optional)"/>
            <input type="text" id="txtCompany" placeholder="Company (optional)"/>
            <input type="text" id="txtTel" placeholder="Tel (optional)"/>
        </div>
        <div data-role="collapsible" data-iconpos="right" data-mini="true" data-content-theme="c">
            <h3>Social</h3>
            <input type="text" id="txtTwitter" placeholder="Twitter handle"/>
        </div>
    </div>
    <br/>

    <button id="btnRegister" data-theme="b">Register</button>

</div>

