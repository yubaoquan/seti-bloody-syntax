module.exports =
  activate: (state) ->
    require( atom.packages.getLoadedPackage('seti-bloody-syntax').path + '/lib/settings').init(state)
