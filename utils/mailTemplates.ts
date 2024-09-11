export interface Template {
  id: string;
  label: string;
  description: string;
  content: string;
  customFields?: {
    [key: string]: {
      label: string;
      type: string;
      placeholder: string;
      default?: string;
    };
  };
}

export const templates: Template[] = [
  {
    id: "template1",
    label: "Business Advertisement",
    description: "A template for advertising your online business",
    content: `<mjml>
  <mj-head>
    <mj-title>Discount Light</mj-title>
    <mj-preview>Pre-header Text</mj-preview>
    <mj-attributes>
      <mj-all font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
      <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-text>
    </mj-attributes>
    <mj-style inline="inline">
      .body-section {
      -webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15);
      -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15);
      box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15);
      }
    </mj-style>
    <mj-style inline="inline">
      .text-link {
      color: #5e6ebf
      }
    </mj-style>
    <mj-style inline="inline">
      .footer-link {
      color: #888888
      }
    </mj-style>

  </mj-head>
  <mj-body background-color="#E7E7E7" width="600px">
    <mj-section full-width="full-width" background-color="#040B4F" padding-bottom="0">
      <mj-column width="100%">
        <mj-image src="https://res.cloudinary.com/dheck1ubc/image/upload/v1544153577/Email/Images/AnnouncementOffset/crofts-white.png" alt="" align="center" width="150px" />
        <mj-text color="#ffffff" font-weight="bold" align="center" text-transform="uppercase" font-size="16px" letter-spacing="1px" padding-top="30px">
          Austin, TX
          <br />
          <span style="color: #979797; font-weight: normal">-</span>
        </mj-text>
        <mj-text color="#17CBC4" align="center" font-size="13px" padding-top="0" font-weight="bold" text-transform="uppercase" letter-spacing="1px" line-height="20px">
          Austin Convention Center
          <br />
          123 Main Street, 78701
        </mj-text>
        <mj-image src="https://res.cloudinary.com/dheck1ubc/image/upload/v1544156968/Email/Images/AnnouncementOffset/header-top.png" width="600px" alt="" padding="0" href="https://google.com" />
      </mj-column>
    </mj-section>
    <mj-section background-color="#1f2e78">
      <mj-column width="100%">
        <mj-image src="https://res.cloudinary.com/dheck1ubc/image/upload/v1544156968/Email/Images/AnnouncementOffset/header-bottom.png" width="600px" alt="" padding="0" href="https://google.com" />
      </mj-column>
    </mj-section>
    <mj-wrapper padding-top="0" padding-bottom="0" css-class="body-section">
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column width="100%">
          <mj-text color="#212b35" font-weight="bold" font-size="20px">
            {{headline}}
          </mj-text>
          <mj-text color="#637381" font-size="16px">
            Hi Jane,
          </mj-text>
          <mj-text color="#637381" font-size="16px">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia a assumenda nulla in quisquam optio quibusdam fugiat perspiciatis nobis, ad tempora culpa porro labore. Repudiandae accusamus obcaecati voluptatibus accusantium perspiciatis.
          </mj-text>
          <mj-text color="#637381" font-size="16px">
            Tempora culpa porro labore. Repudiandae accusamus obcaecati voluptatibus accusantium perspiciatis:
          </mj-text>
          <mj-text color="#637381" font-size="16px">
            <ul>
              <li style="padding-bottom: 20px"><strong>Lorem ipsum dolor:</strong> Sit amet consectetur adipisicing elit.</li>
              <li style="padding-bottom: 20px"><strong>Quia a assumenda nulla:</strong> Repudiandae accusamus obcaecati voluptatibus accusantium perspiciatis.</li>
              <li><strong>Tempora culpa porro labore:</strong> In quisquam optio quibusdam fugiat perspiciatis nobis.</li>
            </ul>
          </mj-text>
          <mj-text color="#637381" font-size="16px" padding-bottom="30px">
            Lorem ipsum dolor <a class="text-link" href="https://google.com">sit amet consectetur</a> adipisicing elit. Earum eaque sunt nulla in, id eveniet quae unde ad ipsam ut, harum autem porro reiciendis minus libero illo. Vero, fugiat reprehenderit.
          </mj-text>
          <mj-button background-color="#5e6ebf" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://google.com" width="300px">
            {{buttonText}}
          </mj-button>
          <mj-button background-color="#5e6ebf" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://google.com" width="300px">
            Book an Appointment
          </mj-button>
          <mj-text color="#637381" font-size="16px" padding-top="30px">
            Lorem ipsum dolor <a class="text-link" href="https://google.com">sit amet consectetur</a> adipisicing elit. Earum eaque sunt nulla in, id eveniet quae unde ad ipsam ut, harum autem porro reiciendis minus libero illo. Vero, fugiat reprehenderit.
          </mj-text>
          <mj-text color="#637381" font-size="16px" padding-bottom="0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0">
        <mj-column width="50%">
          <mj-image align="center" src="https://res.cloudinary.com/dheck1ubc/image/upload/v1544153577/Email/Images/AnnouncementOffset/Image_1.png" alt="" />
        </mj-column>
        <mj-column width="50%">
          <mj-image align="center" src="https://res.cloudinary.com/dheck1ubc/image/upload/v1544153578/Email/Images/AnnouncementOffset/Image_2.png" alt="" />
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0">
        <mj-column width="100%">
          <mj-divider border-color="#DFE3E8" border-width="1px" />
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" padding="0 15px 0 15px">
        <mj-column width="100%">
          <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
            Come see us!
          </mj-text>
          <mj-text color="#637381" font-size="16px">
            We're looking forward to meeting you.
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column width="50%">
          <mj-text color="#212b35" font-size="12px" text-transform="uppercase" font-weight="bold" padding-bottom="0">
            address
          </mj-text>
          <mj-text color="#637381" font-size="14px" padding-top="0">
            Austin Convention Center
            <br />
            123 Main Street, 78701
          </mj-text>
        </mj-column>
        <mj-column width="50%">
          <mj-text color="#212b35" font-size="12px" text-transform="uppercase" font-weight="bold" padding-bottom="0">
            Hours of Operation
          </mj-text>
          <mj-text color="#637381" font-size="14px" padding-top="0">
            Monday, December 20th: 8:00AM - 5:00PM
            <br />
            Tuesday, December 21st: 8:00AM - 5:00PM
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column width="100%">
          <mj-image src="https://res.cloudinary.com/dheck1ubc/image/upload/v1544153579/Email/Images/AnnouncementOffset/map.jpg" alt="" />
        </mj-column>
      </mj-section>
    </mj-wrapper>

    <mj-wrapper full-width="full-width">
      <mj-section>
        <mj-column width="100%" padding="0">
          <mj-social font-size="15px" icon-size="30px" mode="horizontal" padding="0" align="center">
            <mj-social-element name="facebook" href="https://mjml.io/" background-color="#A1A0A0">
            </mj-social-element>
            <mj-social-element name="google" href="https://mjml.io/" background-color="#A1A0A0">
            </mj-social-element>
            <mj-social-element name="twitter" href="https://mjml.io/" background-color="#A1A0A0">
            </mj-social-element>
            <mj-social-element name="linkedin" href="https://mjml.io/" background-color="#A1A0A0">
            </mj-social-element>
          </mj-social>
          <mj-text color="#445566" font-size="11px" font-weight="bold" align="center">
            View this email in your browser
          </mj-text>
          <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            You are receiving this email advertisement because you registered with Croft's Accountants. (123 Main Street, Austin, TX 78701) and agreed to receive emails from us regarding new features, events and special offers.
          </mj-text>
          <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            &copy; Croft's Accountants Inc., All Rights Reserved.
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section padding-top="0">
        <mj-group>
          <mj-column width="100%" padding-right="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px" font-weight="bold">
              <a class="footer-link" href="https://www.google.com">Privacy</a>&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;<a class="footer-link" href="https://www.google.com">Unsubscribe</a>
            </mj-text>
          </mj-column>
        </mj-group>

      </mj-section>
    </mj-wrapper>

  </mj-body>
</mjml>`,
    customFields: {
      headline: {
        label: "Headline",
        type: "primeInputText",
        placeholder: "Enter the main headline",
        default: "Croft's in Austin is opening December 20th",
      },
      buttonText: {
        label: "Button Text",
        type: "primeInputText",
        placeholder: "Enter the button text",
        default: "RSVP Today",
      },
    },
  },
  {
    id: "template2",
    label: "Newsletter",
    description: "A simple newsletter template",
    content: `<mjml>
  <mj-head>
    <mj-title>Say hello to card</mj-title>
    <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500"></mj-font>
    <mj-attributes>
      <mj-all font-family="Montserrat, Helvetica, Arial, sans-serif"></mj-all>
      <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px"></mj-text>
      <mj-section padding="0px"></mj-section>
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#F2F2F2">
    <mj-section padding="10px 0 20px 0">
      <mj-column>
        <mj-text align="center" color="#9B9B9B" font-size="11px">Writing A Good Headline For Your Advertisement</mj-text>
      </mj-column>
    </mj-section>
    <mj-section padding="20px 20px 0 20px" background-color="#FFFFFF">
      <mj-column width="35%">
        <mj-text align="left" font-size="20px" font-weight="500">// BR&amp;AND</mj-text>
      </mj-column>
      <mj-column width="65%">
        <mj-text align="right" font-size="11px"><a href="#" style="color: #000000; text-decoration: none;">HOME</a>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;<a href="#" style="color: #000000; text-decoration: none;">SERVICE</a>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;<a href="#" style="color: #000000; text-decoration: none;">THIRD</a></mj-text>
      </mj-column>
    </mj-section>
    <mj-section padding="20px 20px 0 20px" background-color="#FFFFFF">
      <mj-column>
        <mj-text align="center" font-weight="300" padding="30px 40px 10px 40px" font-size="32px" line-height="40px" color="#5FA91D">Free Advertising For Your Online Business.</mj-text>
      </mj-column>
    </mj-section>
    <mj-section padding="10px 20px" background-color="#FFFFFF">
      <mj-column>
        <mj-divider width="30px" border-width="3px" border-color="#9B9B9B"></mj-divider>
      </mj-column>
    </mj-section>
    <mj-section padding="0 20px 20px 20px" background-color="#FFFFFF">
      <mj-column width="80%">
        <mj-text align="center" padding-top="10px" font-weight="500" padding="0px">A Right Media Mix Can Make The Difference.</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-url="http://nimus.de/share/tpl-card/bg.jpg" vertical-align="middle" background-size="cover" background-repeat="no-repeat">
      <mj-column width="100%">
        <mj-image src="http://nimus.de/share/tpl-card/lineshadow.png" alt="" align="center" border="none" padding="0px"></mj-image>
        <mj-text align="center" padding="50px 40px 0 40px" font-weight="300">Marketers/advertisers usually focus their efforts on the people responsible for making the purchase. In many cases, this is an effective approach but in other cases it can make for a totally useless marketing campaign.</mj-text>
        <mj-button align="center" background-color="#5FA91D" color="#FFFFFF" border-radius="2px" href="#" inner-padding="15px 30px" padding-bottom="100px" padding-top="20px">CALL TO ACTION</mj-button>
      </mj-column>
    </mj-section>
    <mj-section padding="50px 0 0 0" background-color="#FFFFFF">
      <mj-column>
        <mj-image src="http://nimus.de/share/tpl-card/bottom.png" alt="bottom border" align="center" border="none" padding="0px"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section padding="10px 0 20px 0">
      <mj-column>
        <mj-text align="center" color="#9B9B9B" font-size="11px"><a href="#" style="color: #9B9B9B;">Unsubscribe</a> from this newsletter<br />52 Edison Court Suite 259 / East Aidabury / Cambodi<br /> <a href="#" style="color: #9B9B9B; text-decoration:none;">Made by svenhaustein.de</a></mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`,
  },
];
