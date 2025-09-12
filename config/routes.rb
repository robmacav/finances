Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get '/detalhe', to: 'legislacao#detalhe'
  get '/pesquisar_lei', to: 'legislacao#pesquisar_lei'
  get '/pesquisar_leis_mais', to: 'legislacao#pesquisar_leis_mais'
  get '/pesquisar_detalhe_lei/:id', to: 'legislacao#pesquisar_detalhe_lei'
  get '/link_arquivo/:id', to: 'legislacao#link_arquivo'


  get "up" => "rails/health#show", as: :rails_health_check

  root to: 'application#pagina_inicial'

  # get '/baixar_xml/:hashCSSI/:gta', to: 'legislacao#index'

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
