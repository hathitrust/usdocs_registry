Rails.application.routes.draw do
  mount Blacklight::Engine => '/'
  Blacklight::Marc.add_routes(self)
  root to: "catalog#index"
    concern :searchable, Blacklight::Routes::Searchable.new
  
  resource :catalog, only: [:index], as: 'catalog', path: '/catalog', controller: 'catalog' do
    concerns :searchable
  end

  concern :exportable, Blacklight::Routes::Exportable.new
  resources :solr_documents, only:[:show], path: '/catalog', controller: 'catalog' do
    concerns :exportable
  end

  post 'feedback' => 'application#feedback'

  get 'about' => 'pages#about'

  get 'stat_overview' => 'pages#stat_overview'

  get 'tenth_anniversary' => 'pages#tenth_anniversary'

  get 'collection_profile' => 'pages#collection_profile'
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

end
