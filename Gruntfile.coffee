"use strict"

LIVERELOAD_PORT = 35729
lrSnippet = require("connect-livereload")(port: LIVERELOAD_PORT)
mountFolder = (connect, dir) ->
  connect.static require("path").resolve(dir)

module.exports = (grunt) ->

  grunt.initConfig

    pkg:
      name: "plunder"
      version: "0.1.0"
      homepage: "http://city41.github.io/plunder"
      author:
        name: "Matt Greer"

    banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " + "<%= grunt.template.today(\"yyyy-mm-dd\") %>\n" + "<%= pkg.homepage ? \"* \" + pkg.homepage + \"\\n\" : \"\" %>" + "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;" + " Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> */\n"

    connect:
      options:
        port: 9000
        hostname: '0.0.0.0'
      sandbox:
        options:
          middleware: (connect) ->
            [lrSnippet, mountFolder(connect, 'sandbox'), mountFolder(connect, 'dist')]

    open:
      server:
        path: "http://<%= connect.options.hostname %>:<%= connect.options.port %>"

    coffee:
      plunder:
        options:
          bare: true
        expand: true
        flatten: true
        cwd: "src"
        src: ["**/*.coffee"]
        dest: "lib"
        ext: ".js"
      spec:
        options:
          bare: true
        files:
          "specs/JasmineSpecs.js": "specs/specs/**/*Spec.coffee"
          "specs/helpers/helpers.js": "specs/helpers/**/*.coffee"
      sandbox:
        options:
          bare: false
        files:
          "sandbox/sandbox.js": "sandbox/**/*.coffee"
      impactjs:
        options:
          bare: true
        files: "integrations/impactjs/built/plunder-entity.js": "integrations/impactjs/src/**/*.coffee"

    clean:
      files: ["dist/amd", "built", "specs/JasmineSpecs.js"]

     mochaTest:
      test:
        options:
          reporter: 'spec'
        src: [
          'specs/helpers/*helper.coffee'
          'specs/specs/*Spec.coffee'
        ]

    watch:
      sandbox:
        options:
          livereload: LIVERELOAD_PORT
        files: [
          "sandbox/**/*.coffee"
          "src/**/*.coffee"
        ]
        tasks: ["build:sandbox"]


  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-jasmine"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-requirejs"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-open"
  grunt.loadNpmTasks "grunt-mocha-test"

  grunt.registerTask "default", ["mochaTest", "build:plunder"]
  grunt.registerTask "spec", ["mochaTest"]
  grunt.registerTask "build:plunder", ["clean", "coffee:plunder"]
