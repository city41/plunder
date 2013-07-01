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
        files:
          'specs/JasmineSpecs.js': 'specs/**/*.coffee'

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
        keepRunner: false
        specs: 'specs/JasmineSpecs.js'
        template: require('grunt-template-jasmine-requirejs')
        templateOptions:
          requireConfig:
            baseUrl: 'built/'
        # helpers: 'specs/helpers/*.js'

    jshint:
      gruntfile:
        options:
          jshintrc: ".jshintrc"

        src: "Gruntfile.js"

      src:
        options:
          jshintrc: "src/.jshintrc"

        src: ["src/**/*.js"]

      spec:
        options:
          jshintrc: "specs/.jshintrc"

        src: ["specs/**/*.js"]

    watch:
      gruntfile:
        files: "<%= jshint.gruntfile.src %>"
        tasks: ["jshint:gruntfile"]

      src:
        files: "<%= jshint.src.src %>"
        tasks: ["jshint:src", "qunit"]

      spec:
        files: "<%= jshint.test.src %>"
        tasks: ["jshint:spec", "jasmine"]

  
  # These plugins provide necessary tasks.
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-jasmine"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  
  # Default task.
  grunt.registerTask "default", ["jshint", "jasmine", "clean", "concat", "uglify"]
  grunt.registerTask "spec", ["coffee", "jshint:spec", "jasmine"]
