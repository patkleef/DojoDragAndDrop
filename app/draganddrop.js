define([
    "dojo",
    "dojo/_base/declare",
    "dojo/dom-construct", 
    "dojo/on",
    "dojo/_base/lang",
    "dojo/query",
    "dojo/dom-attr",
    "dojo/number",
    "dojo/dnd/Source",
    "dojo/dnd/Target",
    "dojo/dnd/Manager",
    
    "dijit/_Widget"    
], function(
    dojo,
    declare,
    domConstruct,
    on,
    lang,
    query,
    domAttr,
    number,
    Source,
    Target,
    Manager,
    
    Widget
) {
    return declare("app.draganddrop", [
        Widget
    ], 
    {
        source: null,
        target: null,
        eventStatusList: null,
        eventStatusListMouseMoveSourceItem: null,
        eventStatusListMouseMoveTargetItem: null,
        
        postCreate: function() {
            var sourceContainer = domConstruct.create("div", { class: "listContainer" }, this.domNode);
            var sourceTitle = domConstruct.create("h1", { class: "listTitle", innerHTML: "Source" }, sourceContainer);
            var sourceListNode = domConstruct.create("ul", { id: "draganddropSource", class: "sourceList" }, sourceContainer);
            
            var targetContainer = domConstruct.create("div", { class: "listContainer" }, this.domNode);
            var targetTitle = domConstruct.create("h1", { class: "listTitle", innerHTML: "Target" }, targetContainer);
            var targetListNode = domConstruct.create("ul", { id: "draganddropTarget", class: "targetList" }, targetContainer);
            
            this.source = new Source("draganddropSource", { creator: this.sourceItemCreator, copyOnly: true, generateText: false }); 
            this.source.insertNodes(false, [
			        { id: "sourceItem1", text: "item 1", description: "This is item 1", color: "blue" },
                    { id: "sourceItem2", text: "item 2", description: "This is item 2", color: "orange" },
                    { id: "sourceItem3", text: "item 3", description: "This is item 3", color: "green" },
                    { id: "sourceItem4", text: "item 4", description: "This is item 4", color: "grey" },
                    { id: "sourceItem5", text: "item 5", description: "This is item 5", color: "yellow" },
                    { id: "sourceItem6", text: "item 6", description: "This is item 6", color: "red" },
                ]);   
                                      
            this.target = new Source("draganddropTarget", { accept: ["sourceItem"] , creator: this.targetItemCreator }); 
            
            this.registerEvents(this.source, "Source", this.eventStatusListMouseMoveSourceItem);
            this.registerEvents(this.target, "Target", this.eventStatusListMouseMoveTargetItem);
                        
            var eventStatusContainer = domConstruct.create("div", { class: "listContainer" }, this.domNode); 
            var eventStatusTitle = domConstruct.create("h1", { class: "listTitle", innerHTML: "Events" }, eventStatusContainer);
            this.eventStatusList = domConstruct.create("ul", { class: "eventStatusList" }, eventStatusContainer);               
        },
        
        sourceItemCreator: function(item, hint) {
            if(hint == "avatar") {
                var div = domConstruct.create("div", { class: "source-avatar", style: "background-color:" + item.color, innerHTML: item.text});
                
                 return { node:div, data: item, type: ["sourceItem"] };
            }
            var li = domConstruct.create("li", { id: item.id, innerHTML: item.text});
            
            return { node:li, data: item, type: ["sourceItem"] };
        },
        
        targetItemCreator: function(item, hint) {
            var li = domConstruct.create("li", { id: item.id });
            var div = domConstruct.create("div", { class: "target-item", style: "background-color:" + item.color, innerHTML: item.text + ' - ' + item.description }, li)
            
            return { node:li, data: item };
        },
        
        registerEvents: function(containerNode, type, eventMoveItemNode) {
            on(containerNode,'DndDrop', lang.hitch(this, function (source, nodes, copy, target) {   
                domConstruct.create("li", { innerHTML: type + ': DndDrop event' }, this.eventStatusList, "first"); 
            })); 
            on(containerNode,'DraggingOver', lang.hitch(this, function (source, nodes, copy, target) {   
                domConstruct.create("li", { innerHTML: type + ': DraggingOver event' }, this.eventStatusList, "first"); 
            })); 
            on(containerNode,'DraggingOut', lang.hitch(this, function (source, nodes, copy, target) {   
                domConstruct.create("li", { innerHTML: type + ': DraggingOut event' }, this.eventStatusList, "first"); 
            }));  
            on(containerNode,'DropExternal', lang.hitch(this, function (source, nodes, copy, target) {   
                domConstruct.create("li", { innerHTML: type + ': DropExternal event' }, this.eventStatusList, "first"); 
            }));  
            on(containerNode,'DropInternal', lang.hitch(this, function (source, nodes, copy, target) {   
                domConstruct.create("li", { innerHTML: type + ': DropInternal event' }, this.eventStatusList, "first"); 
            }));             
            on(containerNode,'DndCancel', lang.hitch(this, function (source, nodes, copy, target) {   
                domConstruct.create("li", { innerHTML: type + ': DndCancel event' }, this.eventStatusList, "first"); 
            })); 
            on(containerNode, 'OverEvent', lang.hitch(this, function (source, nodes, copy, target) {   
                domConstruct.create("li", { innerHTML: type + ': OverEvent event' }, this.eventStatusList, "first"); 
            }));
            on(containerNode, 'OutEvent', lang.hitch(this, function (source, nodes, copy, target) {   
                domConstruct.create("li", { innerHTML: type + ': OutEvent event' }, this.eventStatusList, "first"); 
            }));
            
            on(containerNode,'MouseMove', lang.hitch(this, function (source, nodes, copy, target) {
                if(eventMoveItemNode == null) {
                    eventMoveItemNode = domConstruct.create("li", { innerHTML: type + ': MouseMove event, count: 1', 'data-count': 1 }, this.eventStatusList, "first"); 
                }
                else {
                    var dataCount = domAttr.get(eventMoveItemNode, "data-count");
                    var count = number.parse(dataCount) + 1;
                    domAttr.set(eventMoveItemNode, "data-count", count);
                    eventMoveItemNode.innerHTML = type + ': MouseMove event, count: ' + count;
                }           
            }));
            on(containerNode,'MouseDown', lang.hitch(this, function (source, nodes, copy, target) {
                domConstruct.create("li", { innerHTML: type + ': MouseDown event' }, this.eventStatusList, "first");          
            }));
            on(containerNode,'MouseUp', lang.hitch(this, function (source, nodes, copy, target) {
                domConstruct.create("li", { innerHTML: type + ': MouseUp event' }, this.eventStatusList, "first");      
            }));
        }        
    })
});
