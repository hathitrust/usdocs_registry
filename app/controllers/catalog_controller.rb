# -*- encoding : utf-8 -*-
class CatalogController < ApplicationController  
  include Blacklight::Marc::Catalog

  include Blacklight::Catalog

  configure_blacklight do |config|
    ## Default parameters to send to solr for all search-like requests. See also SearchBuilder#processed_parameters
    config.default_solr_params = { 
      :qt => 'search',
      :rows => 10 
    }
    
    # solr path which will be added to solr base url before the other solr params.
    #config.solr_path = 'select' 
    
    # items to show per page, each number in the array represent another option to choose from.
    #config.per_page = [10,20,50,100]

    ## Default parameters to send on single-document requests to Solr. These settings are the Blackligt defaults (see SearchHelper#solr_doc_params) or
    ## parameters included in the Blacklight-jetty document requestHandler.
    #
    #config.default_document_solr_params = {
    #  :qt => 'document',
    #  ## These are hard-coded in the blacklight 'document' requestHandler
    #  # :fl => '*',
    #  # :rows => 1
    #  # :q => '{!raw f=id v=$id}' 
    #}

    # solr field configuration for search results/index views
    config.index.title_field = 'title_display'
    config.index.display_type_field = 'format'

    # solr field configuration for document/show views
    #config.show.title_field = 'title_display'
    #config.show.display_type_field = 'format'

    # solr fields that will be treated as facets by the blacklight application
    #   The ordering of the field names is the order of the display
    #
    # Setting a limit will trigger Blacklight's 'more' facet values link.
    # * If left unset, then all facet values returned by solr will be displayed.
    # * If set to an integer, then "f.somefield.facet.limit" will be added to
    # solr request, with actual solr request being +1 your configured limit --
    # you configure the number of items you actually want _displayed_ in a page.    
    # * If set to 'true', then no additional parameters will be sent to solr,
    # but any 'sniffed' request limit parameters will be used for paging, with
    # paging at requested limit -1. Can sniff from facet.limit or 
    # f.specific_field.facet.limit solr request params. This 'true' config
    # can be used if you set limits in :default_solr_params, or as defaults
    # on the solr side in the request handler itself. Request handler defaults
    # sniffing requires solr requests to be made with "echoParams=all", for
    # app code to actually have it echo'd back to see it.  
    #
    # :show may be set to false if you don't want the facet to be drawn in the 
    # facet bar
    config.add_facet_field 'ht_ids', :label => 'HathiTrust Catalog', :query => {
      :ht_full_view => { :label => 'Full View', :fq => "ht_availability:\"full view\"" },
      :ht_limited_view => { :label => 'Limited', :fq => "ht_availability:\"limited view\"" }
      #:ht_full_view => { :label => 'Full View', :fq => "ht_ids_fv:[* TO *]" },
      #:ht_limited_view => { :label => 'Limited', :fq => "ht_ids_lv:[* TO *]" }
    }
      
    config.add_facet_field 'format', :label => 'Format'
    #not the smartest way of doing this, but shouldn't have to touch it again anyway
    config.add_facet_field 'pub_decade', :label => 'Publication Date', :query => {
      :dec_1790s => { :label => '1789 - 1799', :fq => "pub_date:[1789 TO 1799]" },
      :dec_1800s => { :label => '1800 - 1809', :fq => "pub_date:[1800 TO 1809]" },
      :dec_1810s => { :label => '1810 - 1819', :fq => "pub_date:[1810 TO 1819]" },
      :dec_1820s => { :label => '1820 - 1829', :fq => "pub_date:[1820 TO 1829]" },
      :dec_1830s => { :label => '1830 - 1839', :fq => "pub_date:[1830 TO 1839]" },
      :dec_1840s => { :label => '1840 - 1849', :fq => "pub_date:[1840 TO 1849]" },
      :dec_1850s => { :label => '1850 - 1859', :fq => "pub_date:[1850 TO 1859]" },
      :dec_1860s => { :label => '1860 - 1869', :fq => "pub_date:[1860 TO 1869]" },
      :dec_1870s => { :label => '1870 - 1879', :fq => "pub_date:[1870 TO 1879]" },
      :dec_1880s => { :label => '1880 - 1889', :fq => "pub_date:[1880 TO 1889]" },
      :dec_1890s => { :label => '1890 - 1899', :fq => "pub_date:[1890 TO 1899]" },
      :dec_1900s => { :label => '1900 - 1909', :fq => "pub_date:[1900 TO 1909]" },
      :dec_1910s => { :label => '1910 - 1919', :fq => "pub_date:[1910 TO 1919]" },
      :dec_1920s => { :label => '1920 - 1929', :fq => "pub_date:[1920 TO 1929]" },
      :dec_1930s => { :label => '1930 - 1939', :fq => "pub_date:[1930 TO 1939]" },
      :dec_1940s => { :label => '1940 - 1949', :fq => "pub_date:[1940 TO 1949]" },
      :dec_1950s => { :label => '1950 - 1959', :fq => "pub_date:[1950 TO 1959]" },
      :dec_1960s => { :label => '1960 - 1969', :fq => "pub_date:[1960 TO 1969]" },
      :dec_1970s => { :label => '1970 - 1979', :fq => "pub_date:[1970 TO 1979]" },
      :dec_1980s => { :label => '1980 - 1989', :fq => "pub_date:[1980 TO 1989]" },
      :dec_1990s => { :label => '1990 - 1999', :fq => "pub_date:[1990 TO 1999]" },
      :dec_2000s => { :label => '2000 - 2009', :fq => "pub_date:[2000 TO 2009]" },
      :dec_2010s => { :label => "2010 - #{Time.now.year}", :fq => "pub_date:[2010 TO *]" }
    }, :limit => 50
    config.add_facet_field 'pub_date', :label => 'Publication Year', :single => true, :limit => 12, sort: 'index' 
    config.add_facet_field 'author_display', :label => 'Author', :limit => 50
    config.add_facet_field 'subject_topic_facet', :label => 'Subject', :limit => 50 
    config.add_facet_field 'relationships', :show => false 
    #config.add_facet_field 'language_facet', :label => 'Language'#, :limit => true 
    #config.add_facet_field 'lc_1letter_facet', :label => 'Call Number' 
    #config.add_facet_field 'subject_geo_facet', :label => 'Region' 
    #config.add_facet_field 'subject_era_facet', :label => 'Era'  

    #config.add_facet_field 'example_pivot_field', :label => 'Pivot Field', :pivot => ['format', 'language_facet']

   
    #config.add_facet_field 'example_query_facet_field', :label => 'Publish Date', :query => {
    #   :years_5 => { :label => 'within 5 Years', :fq => "pub_date:[#{Time.now.year - 5 } TO *]" },
    #   :years_10 => { :label => 'within 10 Years', :fq => "pub_date:[#{Time.now.year - 10 } TO *]" },
    #   :years_25 => { :label => 'within 25 Years', :fq => "pub_date:[#{Time.now.year - 25 } TO *]" }
    #}


    # Have BL send all facet field names to Solr, which has been the default
    # previously. Simply remove these lines if you'd rather use Solr request
    # handler defaults, or have no facets.
    config.add_facet_fields_to_solr_request!

    # solr fields to be displayed in the index (search results) view
    #   The ordering of the field names is the order of the display 
    config.add_index_field 'title_display', :label => 'Title'
    config.add_index_field 'subtitle_display', :label => 'Subtitle'
    #config.add_index_field 'title_vern_display', :label => 'Title'
    config.add_index_field 'author_display', :label => 'by'
    config.add_index_field 'author_vern_display', :label => ''
    config.add_index_field 'enumchron_display', :label => ''
    #config.add_index_field 'format', :label => 'Format'
    #config.add_index_field 'language_facet', :label => 'Language'
    config.add_index_field 'pub_date', :label => 'Published'
    config.add_index_field 'oclcnum_t', :label => 'oclcnum_t'
    config.add_index_field 'ht_ids', :label => 'Viewable'
    #config.add_index_field 'published_vern_display', :label => 'Published'
    #config.add_index_field 'lc_callnum_display', :label => 'Call number'

    # solr fields to be displayed in the show (single result) view
    #   The ordering of the field names is the order of the display 
    config.add_show_field 'title_display', :label => 'Title'
    config.add_show_field 'title_vern_display', :label => 'Title'
    config.add_show_field 'subtitle_display', :label => 'Subtitle'
    config.add_show_field 'subtitle_vern_display', :label => 'Subtitle'
    config.add_show_field 'author_display', :label => 'Author'
    config.add_show_field 'author_vern_display', :label => 'Author'
    config.add_show_field 'format', :label => 'Format'
    config.add_show_field 'url_fulltext_display', :label => 'URL'
    config.add_show_field 'url_suppl_display', :label => 'More Information'
    config.add_show_field 'language_facet', :label => 'Language'
    config.add_show_field 'publisher_t', :label => 'Publisher'
    config.add_show_field 'published_display', :label => 'Published'
    config.add_show_field 'pub_date', :label => 'Published'
    config.add_show_field 'published_vern_display', :label => 'Published'
    config.add_show_field 'sudoc_display', :label => 'SuDoc Call Number'
    config.add_show_field 'lc_callnum_display', :label => 'LC Call Number'
    config.add_show_field 'isbn_t', :label => 'ISBN'
    config.add_show_field 'oclcnum_t', :label => 'OCLC #'
    config.add_show_field 'material_type_display', :label => 'Physical Description'
    config.add_show_field 'enumchron_display', :label => 'Enumeration/Chronology'
    config.add_show_field 'title_series_t', :label => 'Series Title' 
    config.add_show_field 'ht_ids_fv', :label => 'Viewable'
    config.add_show_field 'ht_ids_lv', :label => 'Viewable'
    config.add_show_field 'relationships', :label => 'Related Items'

    # "fielded" search configuration. Used by pulldown among other places.
    # For supported keys in hash, see rdoc for Blacklight::SearchFields
    #
    # Search fields will inherit the :qt solr request handler from
    # config[:default_solr_parameters], OR can specify a different one
    # with a :qt key/value. Below examples inherit, except for subject
    # that specifies the same :qt as default for our own internal
    # testing purposes.
    #
    # The :key is what will be used to identify this BL search field internally,
    # as well as in URLs -- so changing it after deployment may break bookmarked
    # urls.  A display label will be automatically calculated from the :key,
    # or can be specified manually to be different. 

    # This one uses all the defaults set by the solr request handler. Which
    # solr request handler? The one set in config[:default_solr_parameters][:qt],
    # since we aren't specifying it otherwise. 
    
    config.add_search_field 'all_fields', :label => 'All Fields'
    

    # Now we see how to over-ride Solr request handler defaults, in this
    # case for a BL "search field", which is really a dismax aggregate
    # of Solr search fields. 
    
    config.add_search_field('title') do |field|
      # solr_parameters hash are sent to Solr as ordinary url query params. 
      field.solr_parameters = { :'spellcheck.dictionary' => 'title' }

      # :solr_local_parameters will be sent using Solr LocalParams
      # syntax, as eg {! qf=$title_qf }. This is neccesary to use
      # Solr parameter de-referencing like $title_qf.
      # See: http://wiki.apache.org/solr/LocalParams
      field.solr_local_parameters = { 
        :qf => '$title_qf',
        :pf => '$title_pf'
      }
    end
    
    config.add_search_field('author') do |field|
      field.solr_parameters = { :'spellcheck.dictionary' => 'author' }
      field.solr_local_parameters = { 
        :qf => '$author_qf',
        :pf => '$author_pf'
      }
    end

    config.add_search_field 'sudoc_display', :label => 'SuDoc #' 
    #config.add_search_field('sudoc') do |field|
      #field.solr_local_parameters = {
      #  :qf => '$sudoc_qf',
      #  :pf => '$sudoc_pf'
      #}
    #end
    # Specifying a :qt only to show it's possible, and so our internal automated
    # tests can test it. In this case it's the same as 
    # config[:default_solr_parameters][:qt], so isn't actually neccesary. 
    #config.add_search_field('subject') do |field|
    #  field.solr_parameters = { :'spellcheck.dictionary' => 'subject' }
    #  field.qt = 'search'
    #  field.solr_local_parameters = { 
    #    :qf => '$subject_qf',
    #    :pf => '$subject_pf'
    #  }
    #end

    config.add_search_field 'oclcnum_t', :label => 'OCLC #'

    # "sort results by" select (pulldown)
    # label in pulldown is followed by the name of the SOLR field to sort by and
    # whether the sort is ascending or descending (it must be asc or desc
    # except in the relevancy case).
    config.add_sort_field 'score desc, pub_date_sort desc, title_sort asc', :label => 'relevance'
    config.add_sort_field 'pub_date_sort desc, title_sort asc', :label => 'year descending'
    config.add_sort_field 'pub_date_sort asc, title_sort asc', :label => 'year ascending'
    config.add_sort_field 'author_sort asc, title_sort asc', :label => 'author'
    config.add_sort_field 'title_sort asc, pub_date_sort desc', :label => 'title'

    # If there are more than this many search results, no spelling ("did you 
    # mean") suggestion is offered.
    config.spell_max = 5
  end

end 
