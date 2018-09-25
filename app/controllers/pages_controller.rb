class PagesController < ApplicationController
  def about
  end

  def collection_profile
  end

  def tenth_anniversary
    render "tenth_anniversary", layout: 'tenth_anniversary'
  end
end
