module ApplicationHelper

  #extracts urls to electronic resources
  #currently a subset of 856 links
  def electronic_resources document 
    allowed_urls = [
      /purl\.fdlp\.gov/i,
      /purl\.access\.gpo\.gov/i,
      /biodiversitylibrary\.org/i,
      /fs\.fed\.us/i
    ]
    re = Regexp.union(allowed_urls)

    #[url, link text]
    resources = []
    
    document.to_marc.find_all{|f| '856' === f.tag && f.indicator1 === '4' && f.indicator2 === '0' }.each do | eresource |   
      if eresource['u'].match(re) 
        resources << [eresource['u'], eresource['u']]
      end
    end
    return resources
  end       
    
    
end
