using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using ServiceLayer.DTO;

namespace ServiceLayer
{
    // Should be all the way to the bottom
    public class QueryComposer<T>
    {
        public QueryComposer(PageParameters pageParams)
        {
            pageIndex = pageParams.PageIndex;
            pageSize = pageParams.PageSize;
            sortColumn = pageParams.SortColumn;
            sortOrder = pageParams.SortOrder;
            filterColumn = pageParams.FilterColumn;
            filterQuery = pageParams.FilterQuery;
        }

        public int pageIndex { get; set; }
        public int pageSize { get; set; }
        public string? sortColumn { get; set; }
        public string? sortOrder { get; set; }
        public string? filterColumn { get; set; }
        public string? filterQuery { get; set; }

        public IQueryable BuildQuery(IQueryable queryable)
        {
            var sortColumnIsPresent = (string.IsNullOrEmpty(sortColumn)) ? false : true;
            var sortOrderIsPresemt = (string.IsNullOrEmpty(sortOrder)) ? false : true;
            var filterColumnIsPresent = (string.IsNullOrEmpty(filterColumn)) ? false : true;
            var filterQueryIsPresent = (string.IsNullOrEmpty(filterQuery)) ? false : true;
            var filterColumnIsValid = (filterColumnIsPresent) ? IsValidProperty(filterColumn) : false;
            var sortColumnIsValid = (sortColumnIsPresent) ? IsValidProperty(sortColumn) : false;
        
            
            if( filterQueryIsPresent & filterColumnIsValid & filterColumnIsPresent)
            {
                queryable = queryable.Where(
                    string.Format("{0}.ToUpper().Contains(@0.ToUpper())", filterColumn), filterQuery);
            }
        
            if(sortColumnIsValid & sortColumnIsPresent & sortOrderIsPresemt)
            {
                queryable = queryable.OrderBy(string.Format("{0} {1}", sortColumn, sortOrder));
            }

            queryable = queryable
                        .Skip(pageIndex * pageSize)
                        .Take(pageSize);
            return queryable;
        }




        // Compare the property provided with the <T> Class
        public static bool IsValidProperty(
        string propertyName,                                        // propertyName is the name of the parameter
        bool throwExceptionIfNotFound = true)                       // throwExceptionIfNotFound is the name of the parameter
        {
            var prop = typeof(T).GetProperty(                       // T is the class type that is passsed into ApiResult
                propertyName,                                       // Will if propertyName matches a property in <T>
                BindingFlags.IgnoreCase |                           // To Ignore the case of the name
                BindingFlags.Public |                               // To Include Public Properties in the Search
                BindingFlags.Instance);                             // Must specify Instance or Static to get a return

            if (prop == null && throwExceptionIfNotFound)
                throw new NotSupportedException(
                    String.Format(
                        $"Error: Property '{propertyName}' does not exist."
                        ));
            return prop != null;
        }


    }
}
