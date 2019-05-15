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
import '@polymer/iron-image/iron-image.js';
import 'plastic-image/plastic-image.js';
import '@polymer/iron-icon/iron-icon.js';
import './shared-styles.js';
import './my-icons.js';

class SlideShow extends PolymerElement { 
  static get properties() {
    return {
      chosen: {
        type: String,
        reflectToAttribute: true,
        value: "All"
      }
    }
  }
  static get template() {   
    return html`
      <style include="shared-styles">
      :host {
        height: 100vh;
      }
      .options {
        padding:15px 10px 10px 10px;
        color:#333;
      }
      #clear {
        padding-left:15px;
      }
      a#clear{
        text-decoration:none;
      }
      .options a {
        color: var(--app-primary-color);
      }
      #clear {display:inline}
      #slideshow, #inner {
        display:flex;
        flex-flow:row nowrap;
        width:100vw;
        overflow-y:auto;
        height:80vh;
        scroll-behavior: smooth;
      }
      .paging {
        display:flex;
        justify-content:space-between;
      }
      .paging > div {
        padding:12px 15px;
        margin:0 15px;
        background-color: var(--app-primary-color);
        color:white;
        border-radius:4px;
        cursor:pointer;
      }
      .container {
        flex:1 0 25vw;
        height: auto;
        text-align:center;
      }
      .card {
        height:80%;
        margin:5px;
      }
      .info {
        max-width: 100%;
        min-width: 100%;
        height:100%;
        margin: 8px;
        display:flex;
        flex-flow:column nowrap;
      }
      .info a {
        color: var(--app-primary-color);
      }
      .break {
        word-break:break-word;
        max-width:100%;
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
          url="../api.json"
          params='{}'
          handle-as="json"
          last-response="{{doc}}">
      </iron-ajax>
      <div class='options'><b>Filtering by:</b> {{chosen}}<a href='#' id='clear' on-click="clear">clear filter <iron-icon icon="my-icons:close"></iron-icon></a></div>
      <div id="slideshow" on-scroll="_scrollHandler"><div id="inner">
        <dom-repeat id="repeater" class="iron-list" initialCount="4" items="{{doc.rows}}" as="rows" dom-if="{{rows.see}}" restamp filter="{{isTag(chosen)}}">
          <template >
          
            <div class="container"><div class="card">
              <div class="info">
                <plastic-image lazy-load preload fade sizing="contain" srcset="{{rows.image}}"></plastic-image>
                <div class='break'>{{rows.description}}</div>
                <div>Date: {{rows.date}}</div>
                <div >Tag: <a href='#' class="tag" on-click="setTag">{{rows.tag}}</a></div>
                <div >Source: <a href='#' class="source" on-click="setSource">{{rows.source}}</a></div>
                <div >Org: <a href='#' class="org" on-click="setOrg">{{rows.org}}</a></div>
              </div>
            </div>
            </div>
          </template>

          </dom-repeat>
       </div> </div>
       <div class="paging">
        <div on-click="prev" id="prev"><iron-icon icon="my-icons:chevron-left"></iron-icon> Previous</div> 
        <div on-click="next" id="next">Next <iron-icon icon="my-icons:chevron-right"></iron-icon></div> 
       </div>      
    `;
  }

  prev() {
    const d = this.shadowRoot;
    d.getElementById('inner').scrollLeft -= window.innerWidth;
  }
  next() {
    const d = this.shadowRoot;
    d.getElementById('inner').scrollLeft += window.innerWidth; 
  } 
  setTag(e){
    const mytag = e.model.rows.tag;
    this.chosen = mytag;
  }
  setSource(e){
    const mysource = e.model.rows.source;
    this.chosen = mysource;
  }
  setOrg(e){
    const myorg = e.model.rows.org;
    this.chosen = myorg;
  }
  clear(){
    this.chosen = "All";
  }
  isTag(string) {
    const clear = this.$.clear;
    if ((!string) || (string == "All")) {
      clear.style.display = "none";
      return null;
    } else {
      clear.style.display = "inline";
      return function(rows) {
        const tag = rows.tag;
        const source = rows.source;
        const org = rows.org;
        if ((string == tag) | (string == org) | (string == source)) {
          return true;
        } else {
          return false;
        }
      };   
    }
  }     
}
window.customElements.define('slide-show', SlideShow);



