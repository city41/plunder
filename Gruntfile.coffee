"use strict"
module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig

    # Metadata.
    pkg:
      name: "plunder"
      version: "0.1.0"
      homepage: "http://city41.github.io/plunder"
      author:
        name: "Matt Greer"

    banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " + "<%= grunt.template.today(\"yyyy-mm-dd\") %>\n" + "<%= pkg.homepage ? \"* \" + pkg.homepage + \"\\n\" : \"\" %>" + "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;" + " Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> */\n"


    # Task configuration.
    coffee:
      plunder:
        options:
          bare: true
        expand: true
        flatten: true
        cwd: "src"
        src: ["**/*.coffee"]
        dest: "dist/amd"
        ext: ".js"
      spec:
        options:
          bare: true
        files:
          "specs/JasmineSpecs.js": "specs/specs/**/*Spec.coffee"
          "specs/helpers/helpers.js": "specs/helpers/**/*.coffee"
      sandbox:
        options:
          bare: true
        files:
          "sandbox/sandbox.js": "sandbox/**/*.coffee"
      impactjs:
        options:
          bare: true
        files: "integrations/impactjs/built/plunder-entity.js": "integrations/impactjs/src/**/*.coffee"

    clean:
      files: ["dist/amd", "built", "specs/JasmineSpecs.js"]

    requirejs:
      options:
        baseUrl: "dist/amd"
        name: "main"
        almond: true
        wrap:
          startFile: "support/start.frag"
          endFile: "support/end.frag"
      plunder:
        options:
          out: "dist/<%= pkg.name %>.js"
          optimize: "none"
      min:
        options:
          out: "dist/<%= pkg.name %>.min.js"
          optimize: "uglify"

    jasmine:
      src: "dist/amd/**/*.js"
      options:
        keepRunner: true
        specs: "specs/JasmineSpecs.js"
        template: require("grunt-template-jasmine-requirejs")
        templateOptions:
          requireConfig:
            baseUrl: "dist/amd/"
        helpers: "specs/helpers/**/*.js"

    watch:
      sandbox:
        files: ["sandbox/**/*.coffee", "src/**/*.coffee"]
        tasks: ["sandbox"]


  # These plugins provide necessary tasks.
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-jasmine"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-requirejs"

  # Default task.
  grunt.registerTask "default", ["build:plunder"]
  grunt.registerTask "sandbox", ["clean", "coffee:plunder", "coffee:sandbox", "requirejs:plunder"]
  grunt.registerTask "spec", ["clean", "coffee", "jasmine"]
  grunt.registerTask "build:plunder", ["spec", "clean", "coffee:plunder", "requirejs"]

