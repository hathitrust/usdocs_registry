ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)

Blacklight.secret_key = SecureRandom.hex(64)
ENV['SECRET_KEY_BASE'] = SecureRandom.hex(64)

require 'bundler/setup' # Set up gems listed in the Gemfile.
