desc "Fetches the list of FedDocs OCLC numbers from a github repo and creates a tarball"
task :update_oclc_list do 
  dir = Rails.root.join('public', 'assets').to_s
  puts dir
  `wget -q https://github.com/HTGovdocs/feddoc_oclc_nums/blob/master/feddoc_oclc_nums.txt?raw=true -O #{dir}/feddoc_oclc_nums.txt`
  `gzip -f #{dir}/feddoc_oclc_nums.txt`
end
