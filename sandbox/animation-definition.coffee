module.exports = {
  "type": "forever",
  "children": [{
    "type": "together",
    "id": "g",
    "childConfig": {
      "duration": 2000
    },
    "children": [{
      "type": "rotate",
      "args": [{
        "from": 0,
        "to": 360
      }]
    }, {
      "type": "scale",
      "args": [{
        "from": 1,
        "to": 10
      }]
    }, {
      "type": "color",
      "args": [{
        "from": [255, 0, 0, 1],
        "to": [255, 255, 0, 0.2]
      }]
    }, {
      "type": "move",
      "args": [{
        "from": { "x": 10, "y": 10 },
        "to": { "x": 250, "y": 100 }
      }]
    }]
  }, {
    "type": "wait",
    "args": [1000]
  }, {
    "type": "reverse",
    "args": ["id:g"]
  }]
}
