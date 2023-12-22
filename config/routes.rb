Rails.application.routes.draw do
  devise_for :users 
  resources :settings

  get '/dashboard', to: 'dashboard#index', as: 'dashboard'

  scope :admin do
    get '/users', to: 'admin/users#index', as: 'admin_users'
  end

  resources :tags
  resources :cards
  resources :revenues
  resources :expenses
  resources :expense_categories, path: 'expense-categories'
  
  resources :plannings
  resources :planning_incomes, path: 'planning-incomes'
  resources :planning_expenses, path: 'planning-expenses'
  resources :planning_expense_categories, path: 'planning-expense-categories'
  
  root to: redirect('/dashboard')
end
