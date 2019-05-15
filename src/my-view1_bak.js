/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/iron-image/iron-image.js';
import 'plastic-image/plastic-image.js';
import './shared-styles.js';

class MyView1 extends PolymerElement {
  static get template() {   
    return html`
      <style include="shared-styles">
      :host {
        height: 100vh;
      }
      .container {
        width: 50%;
        height: calc(50vh - 68px);
        text-align:center;
        padding:15px;
      }
      .card {
        height:90%;
      }
      .info {
        width: 100%;
        height:100%;
        margin: 8px;
        display:flex;
        flex-flow:column nowrap;
      }
      plastic-image {
        width:100%;
        height:100%;
      }
      plastic-image, {
        flex:1;
      }
      .info div {
        flex:0;
      }
      .iron-list {
        height: calc(100vh - 105px);
      }

      </style>
      <iron-ajax
          auto
          url="http://gsx2json.com/api?id=1wZa0Gx2yAFDyMVayzRn428SDXCOJHOL-0_IX9uLiWW0"
          params='{}'
          handle-as="json"
          last-response="{{google}}">
      </iron-ajax>

      
        <iron-list class="iron-list" items="{{google.rows}}" as="rows" grid>
          <template >
          
            <div class="container"><div class="card">
              <div class="info">
                <plastic-image lazy-load preload fade sizing="contain" srcset="{{rows.image}}"></plastic-image>
                <div>{{rows.description}}</div>
                <div>Date: {{rows.date}}</div>
                <div>Tags: {{rows.tag}}</div>
              </div>
            </div>
            </div>
          </template>

          </iron-list>
      

    `;
  }
}
window.customElements.define('my-view1', MyView1);


