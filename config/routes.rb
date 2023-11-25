Rails.application.routes.draw do
  resources :plannings
  
  root to: redirect('/plannings')
end
