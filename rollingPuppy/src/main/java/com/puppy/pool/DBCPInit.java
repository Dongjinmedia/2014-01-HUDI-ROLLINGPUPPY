package com.puppy.pool;

import java.util.StringTokenizer;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
 
public class DBCPInit extends HttpServlet{
 
	private static final long serialVersionUID = -3316048440038262557L;

	@Override
    public void init(ServletConfig config) throws ServletException {
    	super.init(config);
    	
        try{
            String drivers = config.getInitParameter("jdbcDriver");
            StringTokenizer st = new StringTokenizer(drivers, ",");
             
            while(st.hasMoreTokens()){
                String jdbcDriver = st.nextToken();
                Class.forName(jdbcDriver);             
            }
             
            Class.forName("org.apache.commons.dbcp.PoolingDriver");
             
        }catch(Exception e){
            throw new ServletException(e);
        }
    }
}