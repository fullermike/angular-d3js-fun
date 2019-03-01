import { Component } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-d3app';
  margin = { top: 20, right: 120, bottom: 20, left: 120 };
  treewidth = 960 - this.margin.right - this.margin.left;
  height = 500 - this.margin.top - this.margin.bottom;
  duration = 750;
  i = 0;
  root;
  tree = d3.layout.tree().size([this.height, this.treewidth]);
  
  diagonal = d3.svg.diagonal().projection(function (d) { return [d.y, d.x]; });

  svg = d3.select("body").append("svg")
  .attr("width", this.treewidth + this.margin.right + this.margin.left)
  .attr("height", this.height + this.margin.top + this.margin.bottom)
  .append("g")
  .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");



  constructor(){

  }

  ngInit() {
    console.log('on init, start d3-');
  }


  treeData() {
    return [
      {
        "name": "Top Level",
        "parent": "null",
        "children": [
          {
            "name": "Level 2: A",
            "parent": "Top Level",
            "children": [
              {
                "name": "Son of A",
                "parent": "Level 2: A"
              },
              {
                "name": "Daughter of A",
                "parent": "Level 2: A"
              }
            ]
          },
          {
            "name": "Level 2: B",
            "parent": "Top Level"
          }
        ]
      }
    ];
  } 


// ************** Generate the tree diagram	 *****************
update(source) {
  // Compute the new tree layout.
  var nodes = this.tree.nodes(this.root).reverse(),
    links = this.tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function (d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = this.svg.selectAll("g.node")
    .data(nodes, function (d) { return d.id || (d.id = ++this.i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    .on("click", this.click);

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
    .attr("x", function (d) { return d.children || d._children ? -13 : 13; })
    .attr("dy", ".35em")
    .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
    .text(function (d) { return d.name; })
    .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(this.duration)
    .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
    .attr("r", 10)
    .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
    .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(this.duration)
    .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
    .remove();

  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  // Update the links…
  var link = this.svg.selectAll("path.link")
    .data(links, function (d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function (d) {
      var o = { x: source.x0, y: source.y0 };
      return this.diagonal({ source: o, target: o });
    });

  // Transition links to their new position.
  link.transition()
    .duration(this.duration)
    .attr("d", this.diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(this.duration)
    .attr("d", function (d) {
      var o = { x: source.x, y: source.y };
      return this.diagonal({ source: o, target: o });
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}


  // Toggle children on click.
  click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d);
  }

initTree() {
  this.root = this.treeData()[0];
  this.root.x0 = this.height / 2;
  this.root.y0 = 0;
  
  this.update(this.root);
  
  d3.select(self.frameElement).style("height", "500px");
}





} // the end.
