<div data-role="header" class="absolute">
    <a id="btnBack" href="#" data-icon="back" data-iconpos="notext">Back</a>

    <h1>User Info</h1>
</div>

<div data-role="content" class="absolute with-bottom-bar">

    <div style="display: inline-block; width: 90px">
        <div id="btnAddPhoto">
            <img id="imgAvatar"
                 src="<% if (user.has('avatar')) { %><%= user.get('avatar').url %> <% } else { %>images/avatar-light.png<% } %>"/>
        </div>
    </div>

    <div style="position:absolute; display: inline-block; top: 5px; left: 105px; right: 15px">
        <h2><%= user.escape('username') %></h2>

        <p><%= user.escape('fullName') %></p>
    </div>

    <% if (user.has('description') && user.get('description') !== '') { %>
    <p>
        <i>
            <%= user.escape('description') %>
        </i>
    </p>
    <% } %>

    <div data-role="collapsible-set">
        <div data-role="collapsible" data-collapsed="true" data-iconpos="right" data-mini="true"
             data-content-theme="c">
            <h3>Basic</h3>

            <p>
                <strong>Email: </strong> <a href="mailto:<%= user.escape('emailAddress') %>"><%=
                user.escape('emailAddress') %></a>
            </p>

            <p>
                <strong>Company: </strong> <%= user.escape('company') %>
            </p>

            <p>
                <strong>Tel: </strong> <a href="tel:<%= user.escape('tel') %>"><%= user.escape('tel') %></a>
            </p>
        </div>

        <div data-role="collapsible" data-iconpos="right" data-mini="true" data-content-theme="c">
            <h3>Social</h3>

            <div class="ui-grid-b">
                <div class="ui-block-a" style="text-align: center">
                    <% if (user.has('twitter') && user.get('twitter') !== '') { %>
                    <a id="btnTwitter" href="#" name="twitter">
                        <img src="images/twitter-logo.png"/>
                    </a>
                    <% } %>
                </div>
                <div class="ui-block-b" style="text-align: center">
                    <% if (user.has('facebook') && user.get('facebook') !== '') { %>
                    <a id="btnFacebook" href="#" name="facebook">
                        <img src="images/facebook-logo.png"/>
                    </a>
                    <% } %>
                </div>
                <div class="ui-block-c" style="text-align: center">
                    <% if (user.has('linkedIn') && user.get('linkedIn') !== '') { %>
                    <a id="btnLinkedIn" href="#" name="linkedIn">
                        <img src="images/linkedIn-logo.png"/>
                    </a>
                    <% } %>
                </div>
            </div>

            <% if (user.has('website') && user.get('website') !== '') { %>
            <br/>

            <p>
                <strong>Website/Blog: </strong> <a id="btnWebsite" href="#"
                                                   name="website"><%=user.escape('website')%></a>
            </p>
            <% } %>

        </div>

    </div>

</div>

<div data-role="footer" style="padding: 10px" class="absolute">
    <button id="btnAddToContacts" data-theme='b'>Add To Contacts</button>
</div>