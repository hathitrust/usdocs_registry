#\ -s puma -p 30499
# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment', __FILE__)


class ScriptName
  def initialize(app, name)
    @app = app
    @name = name
  end

  def call(env)
    env['SCRIPT_NAME'] += @name
    @app.call(env)
  end
end

use ScriptName, '/usdocs_registry'

#map '/usdocs_registry' do
  run Rails.application
#end
