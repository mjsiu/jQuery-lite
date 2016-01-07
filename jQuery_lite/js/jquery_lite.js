(function(root) {
  'use strict';

  var docReadyCallbacks = [],
      docReady = false;

  document.addEventListener('DOMContentLoaded', function() {
    docReady = true;
    docReadyCallbacks.forEach(function(func) {
      func();
    });
  });

  var addDocReadyCallback = function(func) {
    if (!docReady) {
      docReadyCallbacks.push(func);
    } else {
      func();
    }
  };

  var DomNodeCollection = function DomNodeCollection(nodes){
    this.nodes = Array.prototype.slice.call(nodes);
  };

  var getDomNodes = function(selector) {
    var nodes = [].slice.call(document.querySelectorAll(selector), 0);
    return new DomNodeCollection(nodes);
  };

  root.$l = function (arg){
    var returnValue;
    if (arg instanceof Function) {
      addDocReadyCallback(arg);
    }
    if (typeof arg === 'string'){
      returnValue = getDomNodes(arg);
    } else if (arg instanceof HTMLElement ){
      returnValue = new DomNodeCollection([arg]);
    }
    return returnValue;
  };

  root.$l.extend = function (base) {
    var extensions = Array.prototype.slice.call(arguments, 1);

    extensions.forEach(function(obj) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            base[key] = obj[key];
          }
        }
      });
    return base;
  };

  root.$l.ajax = function(options){
    var request = {
      method: 'GET',
      success: function(){console.log("success");},
      error: function(){console.log("error");},
      data: null,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      url: ""
    };

    extend(request, options);

    function reqListener () {
      console.log(this.responseText);
    }

    var req = new XMLHttpRequest();
    req.addEventListener("load", reqListener);
    req.open(request['method'], request['url']);
    req.send();
  };

  DomNodeCollection.prototype = {
    each: function(callback) {
      this.nodes.forEach(callback);
    },

    html: function(string) {
      if (typeof string === "undefined") {
        return this.HTMLels[0].innerHTML;
      }

      this.each(function(el) {
        el.innerHTML = string;
      });
    },

    empty: function() {
      this.html('');
    },

    append: function(arg) {
      if(typeof arg === 'string'){
        this.HTMLels.forEach(function(el) {
          el.innerHTML += arg;
        });
      } else if(arg instanceof HTMLElement){
        // append to first only
        this.HTMLels.forEach(function(el) {
          el.appendChild(arg);
        });
      } else if(arg instanceof DomNodeCollection){
        this.HTMLels.forEach(function(myEl) {
          arg.HTMLels.forEach(function(el) {
            myEl.appendChild(el);
          });
        });
      }
    },

    attr: function(string) {
      for (var i = 0; i < this.HTMLels.length; i++) {
        for (var j = 0; i < this.HTMLels[i].attributes.length; j++) {
          if (this.HTMLels[i].attributes[j].name === string){
            return this.HTMLels[i].attributes[j].value;
          }
        }
      }
    },

    addClass: function(newClass) {
      this.HTMLels.forEach( function(el){
        if (el.hasAttribute("class")) {
          var oldClass = el.getAttribute("class");
          el.setAttribute("class", oldClass + " " + newClass);
        } else {
          el.setAttribute("class", newClass);
        }
      });
    },

    removeClass: function(oldClass) {
      this.HTMLels.forEach( function(el){
        if (el.hasAttribute("class")) {
          var classArray = el.getAttribute("class").split(' ');
        }

        for (var i = 0; i < classArray.length; i++) {
          if (classArray[i] === oldClass) {
            classArray.splice(i, 1);
            el.setAttribute("class", classArray.join(' '));
            return;
          }
        }
      });
    },

    children: function() {
      var childElems = [];
      this.HTMLels.forEach( function(el){
        if(el.children.length >0){
          childElems = childElems.concat(el.children);
        }
      });
      return new DomNodeCollection(childElems);
    },

    parent: function() {
      var parentElems = [];

      this.HTMLels.forEach( function(el){
          parentElems = parentElems.concat(el.parentNode);
      });
      return new DomNodeCollection(parentElems);
    },

    find: function(arg) {
      var matches = [];
      var nodeList = document.querySelectorAll(arg);
      var nodeListArray = [].slice.call(nodeList);
      this.HTMLels.forEach( function(el){
        nodeListArray.forEach(function(node){
          if (el.contains(node)){
            matches.push(node);
          }
        });
      });
      return new DomNodeCollection(matches);
    },

    remove: function(arg) {
      var matched = null;

      if (typeof arg !== "undefined") {
        matched = this.find(arg).HTMLels;
      } else {
        matched = this.HTMLels;
      }

      matched.forEach(function(el) {
        el.parentNode.removeChild(el);
      });
    },

    on: function(type, fn) {
      this.HTMLels.forEach( function(el){
        el.addEventListener( type, fn);
      });
    },

    off: function(type, fn) {
      this.HTMLels.forEach( function(el){
        el.removeEventListener( type, fn);
      });
    }
  };

})(this);
