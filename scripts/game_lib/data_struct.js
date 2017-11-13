// link list
// list <-> item2 <-> item1
function init(list) {
  list._idleNext = list;
  list._idlePrev = list;
}

// show the most idle item
function peek(list) {
  if (list._idlePrev == list) return null;
  return list._idlePrev;
}

// show the least idle item
function last(list) {
    if (list._idleNext == list) return null;
    return list._idleNext;
}

// remove the most idle item from the list
function shift(list) {
  var first = list._idlePrev;
  remove(first);
  return first;
}

// remove a item from its list
function remove(item) {
  if (item._idleNext) {
    item._idleNext._idlePrev = item._idlePrev;
  }

  if (item._idlePrev) {
    item._idlePrev._idleNext = item._idleNext;
  }

  item._idleNext = null;
  item._idlePrev = null;
}

// remove a item from its list and place at the end.
function append(list, item) {
  remove(item);
  item._idleNext = list._idleNext;
  list._idleNext._idlePrev = item;
  item._idlePrev = list;
  list._idleNext = item;
}

function isEmpty(list) {
  return list._idleNext === list;
}

// link list class
function LinkList(obj) {
    this.list = obj;
    init(this.list);
}

LinkList.prototype.peek = function () {
    return peek(this.list);
}

LinkList.prototype.last = function () {
    return last(this.list);
}

LinkList.prototype.shift = function () {
    return shift(this.list);
}

LinkList.prototype.remove = function (item) {
    remove(item);
}

LinkList.prototype.append = function (item) {
    append(this.list, item);
}

LinkList.prototype.isEmpty = function () {
    return isEmpty(this.list);
}

global.LinkList = LinkList;