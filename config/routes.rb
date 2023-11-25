Rails.application.routes.draw do
  resources :plannings
  resources :planning_incomes, path: 'planning-incomes'
  resources :planning_expense_categories, path: 'planning-expense-categories'
  
  root to: redirect('/plannings')
end
