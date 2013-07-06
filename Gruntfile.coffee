"use strict"
module.exports = (grunt) ->
  
  # Project configuration.
  grunt.initConfig
    
    # Metadata.
    banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " + "<%= grunt.template.today(\"yyyy-mm-dd\") %>\n" + "<%= pkg.homepage ? \"* \" + pkg.homepage + \"\\n\" : \"\" %>" + "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;" + " Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> */\n"
    
    # Task configuration.
    coffee:
      src:
        options:
          bare: true
        files:
          'built/plunder.js': 'src/**/*.coffee'
      spec:
        options:
          bare: true
        files:
          'specs/JasmineSpecs.js': 'specs/specs/**/*Spec.coffee'
          'specs/helpers/helpers.js': 'specs/helpers/**/*.coffee'
      sandbox:
        options:
          bare: true
        files:
          'sandbox/sandbox.js': 'sandbox/**/*.coffee'

    clean:
      files: ["built", "specs/JasmineSpecs.js"]

    concat:
      options:
        banner: "<%= banner %>"
        stripBanners: true

      dist:
        src: ["src/<%= pkg.name %>.js"]
        dest: "dist/<%= pkg.name %>.js"

    uglify:
      options:
        banner: "<%= banner %>"

      dist:
        src: "<%= concat.dist.dest %>"
        dest: "dist/<%= pkg.name %>.min.js"

    jasmine:
      src: 'built/**/*.js'
      options:
        keepRunner: true
        specs: 'specs/JasmineSpecs.js'
        template: require('grunt-template-jasmine-requirejs')
        templateOptions:
          requireConfig:
            baseUrl: 'built/'
        helpers: 'specs/helpers/**/*.js'
        
    watch:
      sandbox:
        files: ['sandbox/**/*.coffee', 'src/**/*.coffee']
        tasks: ['coffee:sandbox', 'coffee:src']

  
  # These plugins provide necessary tasks.
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-jasmine"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  
  # Default task.
  grunt.registerTask "default", ["jasmine", "clean", "concat", "uglify"]
  grunt.registerTask "spec", ["clean", "coffee", "jasmine"]

