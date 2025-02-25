class APIServies extends Helpers {
    async login(body) {
        const { data } = await axios.post(`${backendAPI}/login`, { ...body });
    
        super.storeToken(data?.data?.token);
    
        return data;
      }
    
      async register(body) {
        const { data } = await axios.post(`${backendAPI}/register`, { ...body });
    
        super.storeToken(data?.data?.token);
    
        return data;
      }
    
      async getDesignation() {
        const { data } = await axios.get(`${backendAPI}/designation`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${super.getToken()}`,
          },
        });
    
        return data;
      }
}