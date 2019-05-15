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
import { setSyncInitialRender } from '@polymer/polymer/lib/utils/settings';

class SlideShow extends PolymerElement { 
  static get properties() {
    return {
      chosen: {
        type: String,
        reflectToAttribute: true,
        value: "All"
      },
      criteria: {
        type: String,
        reflectToAttribute: true,
        value: "default"
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
      .options a.sort {
        padding: 0px 5px;
        cursor:pointer;
      }
      .sorting {
        padding-left:15px;
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
      <div class='options'>
        <span class='filter'><b>Filtering by:</b> {{chosen}}<a href='#' id='clear' on-click="clear">clear filter <iron-icon icon="my-icons:close"></iron-icon></a></span>
        <span class='sorting'><b> Sort by:</b> <a class="sort default" on-click="default">Default</a><a class="sort date" on-click="date">Date</a><a class="sort active" on-click="active">Active</a></span>
      </div>
      <div id="slideshow"><div id="inner">
        <dom-repeat id="repeater" class="iron-list" initialCount="4" items="{{doc.rows}}" as="rows" restamp filter="{{isTag(chosen)}}" sort="{{sort(criteria)}}" mutable-data>
          <template >
          
            <div class="container"><div class="card">
              <div class="info">
                <plastic-image lazy-load preload fade sizing="contain" srcset="{{rows.image}}"></plastic-image>
                <div class='break'>{{rows.description}}</div>
                <div>Date: {{rows.date}}</div>
                <div >Tag: <a href='#' class="tag" on-click="setTag">{{rows.tag}}</a></div>
                <div >Source: <a href='#' class="source" on-click="setSource">{{rows.source}}</a></div>
                <div >Org: <a href='#' class="org" on-click="setOrg">{{rows.org}}</a></div>
                <div >Active: {{rows.active}}</div>
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

  // Handle sorting
  date(e) {
    this.criteria = "date";
  }
  active(e) {
    this.criteria = "active";
  } 
  default(e) {
    this.criteria = "default";
  }   
  sort(criteria) {
    if (!criteria || criteria == "default") {
      return 0;
    } else if ( criteria == "date") {
      // deal with the Y2K problem
      return function(a,b) {
        const dateASplit = a.date.split("/");
        let yearA = dateASplit[2];
        if (yearA.length < 4) {
          while (yearA.length < 4) { yearA= "0" + yearA;}
        }
        const sA = yearA + dateASplit[0] + dateASplit[1];
        const dateBSplit = b.date.split("/");
        let yearB = dateBSplit[2];
        if (yearB.length < 4) {
          while (yearB.length < 4) { yearB= "0" + yearB;}
        }
        const sB = yearB + dateBSplit[0] + dateBSplit[1];
        if (sA < sB) {
          return -1;
        }
        if (sA > sB) {
          return 1;
        }
        return 0;
      } 
    } else {
      return function(a,b) {
        let c = a.active;
        let d = b.active;
        if (c < d) {
          return -1;
        }
        if (d > c) {
          return 1;
        }
        return 0;
      } 
    }
  }

  // Navigation controls
  prev() {
    const d = this.shadowRoot;
    d.getElementById('inner').scrollLeft -= window.innerWidth;
  }
  next() {
    const d = this.shadowRoot;
    d.getElementById('inner').scrollLeft += window.innerWidth; 
  } 

  // Assign Filters
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



